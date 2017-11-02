const { validarService } = require("./upload-config");

const FILE_NAME = "OPN2001_DATA";

const generateSOAP = (deviceId, scans) => {
	let soapStr = getSoapHeader(deviceId);
	soapStr += getSoapDataClass(scans);
	soapStr += getSoapDataFiles(scans);
	soapStr += getSoapFooter();
	return soapStr;
};

// Get Soap part with device ID and partner ID
const getSoapHeader = deviceId => {
	return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <UploadRemoteData xmlns="https://portal.validar.com/PortalWebServices/V2/RemoteDataAcquirer">
          <deviceId>${deviceId}</deviceId>
          <partnerId>${validarService.partnerId}</partnerId>`;
};

// Test for session data and return appropriate dataClass guid
const getSoapDataClass = scans => {
	let sessionFlag = false;
	scans.forEach(scan => {
		if (scan.data && scan.data.indexOf("-SC-") > -1) {
			sessionFlag = true;
		}
	});
	return `<dataClass>${sessionFlag
		? validarService.sessionDataClass
		: validarService.leadsDataClass}</dataClass>`;
};

// Get Soap Data Files elements
const getSoapDataFiles = scans => {
	// Add Data Files Header
	let dataFilesString = `<dataFiles>
    <DataFile>
      <FileName>${FILE_NAME}</FileName>
      <Data>`;

	// Get XML version
	const xmlScanString = convertScansToXML(scans);

	// Base64 and pass into data element
	dataFilesString += Buffer.from(xmlScanString).toString("base64");

	// Add Data files footer
	dataFilesString += `</Data></DataFile></dataFiles>`;
	return dataFilesString;
};

// Convert scans object to XML
const convertScansToXML = scans => {
	// Scan Array Header
	let xmlStr = `<?xml version="1.0" encoding="utf-8"?>
    <ArrayOfQuickScanDataRecord xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">`;

	// Scan Records
	scans.forEach(scan => {
		if (scan.data) {
			xmlStr += `<QuickScanDataRecord>
                <ScanDateTime>${scan.time}</ScanDateTime>
                <BarCode>${scan.data}</BarCode>
            </QuickScanDataRecord>`;
		}
	});

	// Scan Array Footer
	xmlStr += `</ArrayOfQuickScanDataRecord>`;
	return xmlStr;
};

// Get Soap Footer with deactivateReservationAfterUpload set to false
const getSoapFooter = () => {
	return `<deactivateReservationAfterUpload>false</deactivateReservationAfterUpload>
    </UploadRemoteData>
  </soap:Body>
</soap:Envelope>`;
};

module.exports.generateSOAP = generateSOAP;
