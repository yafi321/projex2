import "./InputForm.css"; 
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//ייבוא האייקונים
import markerIcon2x from "/src/assets/image/marker-icon-2x.png";
import markerIcon from "/src/assets/image/marker-icon.png";
import markerShadow from "/src/assets/image/marker-shadow.png";

// הגדרת האייקונים
const customIcon = new L.Icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

//הגדרת המפה
const MapUpdater = ({ lat, lon }) => {
    const map = useMap();

    useEffect(() => {
        map.setView([lat, lon], map.getZoom());
    }, [lat, lon, map]);

    return null;
};

const InputForm = () => {
    const [address, setAddress] = useState("");//כתובת
    const [suggestions, setSuggestions] = useState([]);//הצעות כתובות
    const [addressObj, setAddressObj] = useState({ lat: 32.0874, lon: 34.8324 });//אובייקט כתובת

    async function changeAddress(e) {//פונקציה לשינוי הכתובת באינפוט ובמפה
        let userInput = e.target.value;//הכתובת שהמשתמש הקיש
        setAddress(userInput);

        if (userInput.length > 2) {//כאשר הקלט גדול מ - 2 מביא את חמשת הכתובות המתאימות ומעדכן אותם בתיבת ההצעות 
            try {
                const response = await fetch(//שליפת הכתובות
                    `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
                        userInput
                    )}`
                );
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.log("Error fetching address suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    }

    function suggestionsClick(suggestion) {//בעת לחיצה על כתובת מסוימת שהגיעה מהשלמת הכתובות,
    //  עדכון הכתובת באובייקט כדי ליצור שינוי על המפה
        //וכן עדכון הכתובת באינפוט
        setAddress(suggestion.display_name);
        setAddressObj({
            lat: parseFloat(suggestion.lat),
            lon: parseFloat(suggestion.lon),
        });
        setSuggestions([]);
    }

    return (//הטופס
        <div className="form-container">
            <form className="styled-form">
                <h2 className="form-title">Search Form</h2>
                <div className="form-group">
                    <label htmlFor="address">Address for search:</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={changeAddress}
                        placeholder="Type your address"
                    />
                    <ul className="suggestions-list">
                        {suggestions.map((item) => (
                            <li
                                key={item.place_id}
                                onClick={() => suggestionsClick(item)}
                                className="suggestion-item"
                            >
                                {item.display_name}
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="leaflet-container">
                    <MapContainer
                        style={{ width: "100%", height: "400px" }}//הגדרות של המפה
                        center={[addressObj.lat, addressObj.lon]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[addressObj.lat, addressObj.lon] }  icon={customIcon}>
                            <Popup>{address}</Popup>
                        </Marker>
                        <MapUpdater lat={addressObj.lat} lon={addressObj.lon} />
                    </MapContainer>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" name="phone" id="phone" placeholder="Enter your phone" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" placeholder="Enter your email" />
                </div>

                <div className="form-group-checkbox">
                    <input type="checkbox" name="internet" id="internet" />
                    <label htmlFor="internet">With internet</label>
                </div>

                <div className="form-group-checkbox">
                    <input type="checkbox" name="kitchen" id="kitchen" />
                    <label htmlFor="kitchen">With kitchen</label>
                </div>

                <div className="form-group-checkbox">
                    <input type="checkbox" name="coffee" id="coffee" />
                    <label htmlFor="coffee">With coffee machine</label>
                </div>

                <div className="form-group">
                    <label htmlFor="rooms">Num of rooms:</label>
                    <input type="number" name="rooms" id="rooms" placeholder="Number of rooms" />
                </div>

                <div className="form-group">
                    <label htmlFor="distance">Distance from place:</label>
                    <input
                        type="number"
                        name="distance"
                        id="distance"
                        placeholder="Enter distance"
                    />
                </div>
                <input type="hidden" value={"search"}/>

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>

        </div>

    );
};

export default InputForm;

