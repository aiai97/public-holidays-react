import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API = "https://openholidaysapi.org";

async function fetchJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}

function getCountryName(country) {
    return (
        country.name.find(item => item.language === "EN")?.text
        ?? country.isoCode
    );
}

export default function PublicHolidays() {
    const [countryCode, setCountryCode] = useState("NL");

    const today = new Date().toISOString().slice(0, 10);

    const [validFrom, setValidFrom] = useState(`${today.slice(0, 4)}-01-01`);
    const [validTo, setValidTo] = useState(`${today.slice(0, 4)}-12-31`);
    const [draftFrom, setDraftFrom] = useState(validFrom);
    const [draftTo, setDraftTo] = useState(validTo);
    const isDraftValid =
        Boolean(draftFrom) && Boolean(draftTo) && draftFrom <= draftTo;

    function handleSearch() {
        setValidFrom(draftFrom);
        setValidTo(draftTo);
    }

    const {
        data: countries = [],
        isLoading: countriesLoading,
        isError: countriesError,
    } = useQuery({
        queryKey: ["countries"],
        queryFn: () => fetchJson(`${API}/Countries`),
    });

    const isDateRangeValid =
        Boolean(validFrom) && Boolean(validTo) && validFrom <= validTo;

    const {
        data: holidays = [],
        isLoading: holidaysLoading,
        isError: holidaysError,
    } = useQuery({
        queryKey: ["holidays", countryCode, validFrom, validTo],
        queryFn: () => {
            const params = new URLSearchParams({
                countryIsoCode: countryCode,
                languageIsoCode: "EN",
                validFrom,
                validTo,
            });

            return fetchJson(
                `${API}/PublicHolidays?${params.toString()}`
            );
        },
        enabled: Boolean(countryCode) && isDateRangeValid,
    });

    if (countriesLoading) {
        return <main className="container">Loading countries...</main>;
    }

    if (countriesError) {
        return <main className="container">Failed to load countries.</main>;
    }

    const sortedHolidays = [...holidays].sort(
        (a, b) => a.startDate.localeCompare(b.startDate)
    );

    return (
        <main className="container">
            <h1>Public Holidays</h1>
            <p>National holidays from {validFrom} to {validTo}</p>

            <div className="filters">
                <div className="filter-item">
                    <label htmlFor="country">Select a country</label>
                    <select
                        id="country"
                        value={countryCode}
                        onChange={event => setCountryCode(event.target.value)}
                    >
                        {countries.map(country => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {getCountryName(country)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="validFrom">Start date</label>
                    <input
                        id="validFrom"
                        type="date"
                        value={draftFrom}
                        onChange={event => setDraftFrom(event.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="validTo">End date</label>
                    <input
                        id="validTo"
                        type="date"
                        value={draftTo}
                        min={draftFrom}
                        onChange={event => setDraftTo(event.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={!isDraftValid}
                    >
                        Search
                    </button>
                </div>
            </div>
            <h2>
                Holidays in{" "}
                {countries.find(c => c.isoCode === countryCode)
                    ? getCountryName(
                        countries.find(c => c.isoCode === countryCode)
                    )
                    : countryCode}
            </h2>

            {!isDateRangeValid && (
                <p>Please select a valid start and end date.</p>
            )}

            {isDateRangeValid && holidaysLoading && <p>Loading holidays...</p>}

            {isDateRangeValid && holidaysError && <p>Failed to load holidays.</p>}

            {isDateRangeValid && !holidaysLoading && !holidaysError && (
                sortedHolidays.length > 0 ? (
                    <ul>
                        {sortedHolidays.map(holiday => (
                            <li key={holiday.id}>
                                <strong>{holiday.startDate}</strong>
                                {" — "}
                                {holiday.name.find(
                                    item => item.language === "EN"
                                )?.text ?? "Unnamed holiday"}
                                {holiday.endDate !== holiday.startDate &&
                                    ` (${holiday.startDate} to ${holiday.endDate})`}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No holidays found for this country and year.</p>
                )
            )}
        </main>
    );
}
