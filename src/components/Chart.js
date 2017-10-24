import React from "react";
import "../styles/chart.css";

const Chart = ({ title, data }) => {
	return (
		<figure className="chart">
			<figcaption>{title}</figcaption>
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				className="chart-svg"
				height={data.length * 35}
			>
				{data.map((point, idx) => {
					const rectY = idx * 35;
					const width = point.percent * 1.85;
					return (
						<g className="bar" key={point.id}>
							<rect width={width} height="29" y={rectY} rx="2" ry="2" />
							<text x={width + 10} y={rectY + 14.5} dy=".35em">
								{point.total} {point.total > 1 ? "scans" : "scan"} on{" "}
								{point.time}
							</text>
						</g>
					);
				})}
			</svg>
		</figure>
	);
};

export default Chart;
