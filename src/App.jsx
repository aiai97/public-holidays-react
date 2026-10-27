import { useState } from 'react';
import Accordion from './components/Accordion';
import { accordionData } from './utils/accordiondata';

const App = () => {
  const [openAccordion, setOpenAccordion] = useState(null);

  return (
      <div className="container">
        <h1>React Accordion Demo</h1>
        <div>
          {accordionData.map(({ title, content }) => (
              <Accordion
                key={title}
                title={title}
                content={content}
                isActive={openAccordion === title}
                onToggle={() =>
                  setOpenAccordion(current => current === title ? null : title)
                }
              />
          ))}
        </div>
      </div>
  );
};

export default App;
