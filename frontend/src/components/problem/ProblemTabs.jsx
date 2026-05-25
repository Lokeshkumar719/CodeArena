import {
  FiFileText,
  FiBookOpen,
  FiCode,
  FiClock,
  FiTerminal,
} from "react-icons/fi";

const tabIcons = {
  description: <FiFileText size={16} />,
  editorial: <FiBookOpen size={16} />,
  solutions: <FiCode size={16} />,
  submissions: <FiClock size={16} />,
  code: <FiCode size={16} />,
  testcase: <FiTerminal size={16} />,
  result: <FiTerminal size={16} />,
};

function ProblemTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 p-2 bg-base-200 border-b border-base-300 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            flex items-center gap-2
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 whitespace-nowrap
            ${
              activeTab === tab
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-100 hover:bg-base-300 text-base-content"
            }
          `}
        >
          {tabIcons[tab]}
          <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
        </button>
      ))}
    </div>
  );
}

export default ProblemTabs;
