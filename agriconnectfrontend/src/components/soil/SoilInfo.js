import React, { useState } from "react";
import "./SoilInfo.css";

const SoilInfo = () => {
  const soilTypes = [
    {
      name: "Alluvial Soil",
      crops: "Wheat, Rice, Sugarcane, Pulses, Oilseeds",
      description:
        "Highly fertile, found in river basins and deltas. Supports a wide variety of crops. Rich in potash but poor in nitrogen and phosphorus. Extensively found in northern India.",
    },
    {
      name: "Black Soil (Regur)",
      crops: "Cotton, Soybean, Sorghum, Millets, Sunflower",
      description:
        "Moisture-retentive and ideal for dryland farming. Rich in lime, iron, magnesium, and aluminum. Predominantly found in Maharashtra, Madhya Pradesh, and Gujarat.",
    },
    {
      name: "Red Soil",
      crops: "Groundnut, Pulses, Tobacco, Rice, Millets",
      description:
        "Low in nitrogen, phosphorus, and humus. Slightly acidic and porous. Found in Tamil Nadu, Karnataka, Odisha, and Chhattisgarh.",
    },
    {
      name: "Laterite Soil",
      crops: "Tea, Coffee, Cashew, Coconut, Tapioca",
      description:
        "Rich in iron and aluminum but poor in nitrogen. Found in high rainfall areas like the Western Ghats, parts of Odisha, and Assam. Ideal for plantation crops.",
    },
    {
      name: "Desert Soil",
      crops: "Barley, Bajra, Mustard, Dates",
      description:
        "Sandy, porous, and low in organic matter. Requires irrigation and manure. Found in Rajasthan and Gujarat.",
    },
    {
      name: "Mountain Soil",
      crops: "Tea, Spices, Apples, Coffee",
      description:
        "Highly organic and fertile but prone to erosion. Found in Himalayan regions. Suitable for horticulture and plantation.",
    },
    {
      name: "Peaty & Marshy Soil",
      crops: "Paddy, Jute, Sugarcane",
      description:
        "High organic content and acidic in nature. Found in waterlogged areas of Kerala, West Bengal, and Bihar.",
    },
    {
      name: "Saline & Alkaline Soil",
      crops: "Cotton, Barley, Rice (after treatment)",
      description:
        "Infertile without treatment. High in salts, requires reclamation with gypsum or green manures. Found in parts of UP, Punjab, and Gujarat.",
    },
  ];

  const [expanded, setExpanded] = useState(Array(soilTypes.length).fill(false));

  const toggleReadMore = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const getShortDescription = (text) =>
    text.split(".").slice(0, 1).join(".") + ".";

  return (
    <section className="soil" id="soil">
      <h2>🌾 What is Farming?</h2>
      <p className="soil__text">
        Farming is the practice of cultivating soil, growing crops, and raising
        animals to produce food and other agricultural products. It forms the
        backbone of the economy in many countries and provides livelihood and
        nutrition to people worldwide.
      </p>

      <h2>🛠 How is Farming Done?</h2>
      <ul className="soil__list">
        <li>🚜 <strong>Soil Preparation:</strong> Plowing, leveling, and fertilizing the land.</li>
        <li>🌱 <strong>Sowing:</strong> Planting quality seeds at proper depth and spacing.</li>
        <li>💧 <strong>Irrigation:</strong> Using canals, drip, or sprinkler systems.</li>
        <li>🪲 <strong>Crop Protection:</strong> Controlling pests, weeds, and diseases.</li>
        <li>🌾 <strong>Harvesting:</strong> Collecting mature crops by hand or machine.</li>
        <li>🏠 <strong>Storage & Marketing:</strong> Safe storage and sale of produce.</li>
      </ul>

      <h2>🌿 What is Multi-Farming?</h2>
      <p className="soil__text">
        Multi-farming, also known as mixed or integrated farming, is the practice of
        growing different crops or combining crops with livestock on the same land.
        It maximizes land use, increases income, and improves soil health.
      </p>

      <h3 style={{ marginBottom: "1rem" }}>Crops Grown in Multi-Farming:</h3>
      <ul className="soil__list">
        <li>🐟 <strong>Rice + Fish Farming:</strong> Increases yield and controls pests.</li>
        <li>🍅 <strong>Vegetables + Fruit Trees:</strong> Example: Tomato with Mango.</li>
        <li>🐐 <strong>Crop + Livestock:</strong> Maize with goats or poultry.</li>
        <li>🌳 <strong>Agroforestry:</strong> Combining trees with crops.</li>
      </ul>

      <h2>🌱 Know Your Soil</h2>
      <div className="soil__cards">
        {soilTypes.map((soil, index) => (
          <div className="soil__card" key={index}>
            <h3>{soil.name}</h3>
            <p><strong>Best Crops:</strong> {soil.crops}</p>
            <p>
              {expanded[index]
                ? soil.description
                : getShortDescription(soil.description)}
              <button
                className="read-more-btn"
                onClick={() => toggleReadMore(index)}
              >
                {expanded[index] ? "Read Less" : "Read More"}
              </button>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SoilInfo;
