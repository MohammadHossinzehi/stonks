export default function HighlightsPanel() {
    return (
      <div className="bg-[#F4F4F9] text-gray-800 p-6 rounded-lg shadow text-base leading-relaxed">
        <h2 className="text-xl font-semibold mb-2 text-[#3D52A0]">📘 How to Interpret Trade Signals</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Score = Buys - Sells</strong>. Positive = bullish; negative = bearish.</li>
          <li>0 = Neutral or balanced activity.</li>
          <li>Use this insight to guide further research — not as financial advice.</li>
        </ul>
        <p>
          This section provides insight into how political trades reflect sentiment shifts. 
          Combine this with fundamentals and market news for best results.
        </p>
      </div>
    );
  }