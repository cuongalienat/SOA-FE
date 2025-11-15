import React, { useState, useRef, useEffect } from "react";
import "./LocationSelector.css";

export default function LocationSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState("TP. HCM");
    const wrapperRef = useRef(null);

    const cities = [
        "TP. HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng",
        "Huế", "Khánh Hoà", "Đồng Nai", "Nghệ An", "Vũng Tàu",
        "An Giang", "Bạc Liêu", "Bắc Giang", "Bắc Ninh", "Bến Tre",
        "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận"
    ];

    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="location-selector" ref={wrapperRef}>
            <button
                className="location-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span role="img" aria-label="pin">📍</span> {selected}{" "}
                <span className="arrow">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="dropdown">
                    <input
                        type="text"
                        placeholder="Tìm tỉnh/thành..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <ul className="city-list">
                        {filteredCities.map((city) => (
                            <li
                                key={city}
                                className={city === selected ? "active" : ""}
                                onClick={() => {
                                    setSelected(city);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                            >
                                {city}
                            </li>

                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
