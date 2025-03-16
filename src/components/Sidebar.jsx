import { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                ☰
            </button>
            <ul>
                <li>Opción 1</li>
                <li>Opción 2</li>
                <li>Opción 3</li>
            </ul>
        </aside>
    );
};

export default Sidebar;
