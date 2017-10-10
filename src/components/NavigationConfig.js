// Component Imports
import SummaryContent from "./SummaryContent";
import DataContent from "./DataContent";
import DeviceContent from "./DeviceContent";

// Main Navigation
const navigation = [
	{ title: "Summary", icon: "home", comp: SummaryContent },
	{ title: "Data", icon: "people", comp: DataContent },
	{ title: "Devices", icon: "build", comp: DeviceContent }
];

export default navigation;
