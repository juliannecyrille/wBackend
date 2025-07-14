import React, { useState, useEffect } from 'react';

function App() {
  // State for form fields
  const [studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [ayAdmitted, setAyAdmitted] = useState('');
  const [semAdmitted, setSemAdmitted] = useState('');
  const [graduationDate, setGraduationDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');
  const [purposeOfRequest, setPurposeOfRequest] = useState('');
  const [purposeOfRequestForFurtherStudies, setPurposeOfRequestForFurtherStudies] = useState('');
  // DocumentRequested
  const [documentId, setDocumentId] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [attachmentFile, setAttachmentFile] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  // ReceiptDetailsSubmission
  const [orNumber, setOrNumber] = useState('');
  const [originalReceipt, setOriginalReceipt] = useState('');

  useEffect(() => {
    fetch('server/test')
      .then(res => res.json())
      .then(data => console.log(data.message))
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Payload for requestform
    const requestFormPayload = {
      studentNumber,
      firstName,
      lastName,
      middleName,
      degreeProgram,
      selectedCollege,
      ayAdmitted,
      semAdmitted,
      graduationDate,
      phoneNumber,
      emailAddress,
      address: {
        streetNumber,
        barangay,
        municipality,
        province
      },
      purposeOfRequest,
      purposeOfRequestForFurtherStudies
    };

    // 2. Payload for documentRequested
    const documentRequestedPayload = {
      documentId,
      studentNumber,
      firstName,
      lastName,
      middleName,
      degreeProgram,
      ayAdmitted,
      semAdmitted,
      documentType,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity),
      attachmentFile,
      totalAmount: parseFloat(totalAmount),
      transactionRef
    };

    // 3. Payload for receiptDetailsSubmission
    const receiptDetailsPayload = {
      orNumber,
      documentId,
      firstName,
      lastName,
      middleName,
      studentNumber,
      transactionRef,
      originalReceipt
    };

    try {
      await fetch('http://localhost:5000/api/requestForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestFormPayload)
      });

      await fetch('http://localhost:5000/api/documentRequested', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentRequestedPayload)
      });

      await fetch('http://localhost:5000/api/receiptDetailsSubmission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptDetailsPayload)
      });

      console.log('All data submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Student Number" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} />
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <input type="text" placeholder="Middle Name" value={middleName} onChange={e => setMiddleName(e.target.value)} />
        <input type="text" placeholder="Degree Program" value={degreeProgram} onChange={e => setDegreeProgram(e.target.value)} />
        <input type="text" placeholder="Selected College" value={selectedCollege} onChange={e => setSelectedCollege(e.target.value)} />
        <input type="text" placeholder="AY Admitted" value={ayAdmitted} onChange={e => setAyAdmitted(e.target.value)} />
        <input type="text" placeholder="Sem Admitted" value={semAdmitted} onChange={e => setSemAdmitted(e.target.value)} />
        <input type="date" placeholder="Graduation Date" value={graduationDate} onChange={e => setGraduationDate(e.target.value)} />
        <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        <input type="email" placeholder="Email Address" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
        <input type="text" placeholder="Street Number" value={streetNumber} onChange={e => setStreetNumber(e.target.value)} />
        <input type="text" placeholder="Barangay" value={barangay} onChange={e => setBarangay(e.target.value)} />
        <input type="text" placeholder="Municipality" value={municipality} onChange={e => setMunicipality(e.target.value)} />
        <input type="text" placeholder="Province" value={province} onChange={e => setProvince(e.target.value)} />
        <input type="text" placeholder="Purpose of Request" value={purposeOfRequest} onChange={e => setPurposeOfRequest(e.target.value)} />
        <input type="text" placeholder="Purpose of Request for Further Studies" value={purposeOfRequestForFurtherStudies} onChange={e => setPurposeOfRequestForFurtherStudies(e.target.value)} />
        {/* DocumentRequested fields */}
        <input type="text" placeholder="Document ID" value={documentId} onChange={e => setDocumentId(e.target.value)} />
        <input type="text" placeholder="Document Type" value={documentType} onChange={e => setDocumentType(e.target.value)} />
        <input type="number" placeholder="Unit Price" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <input type="text" placeholder="Attachment File" value={attachmentFile} onChange={e => setAttachmentFile(e.target.value)} />
        <input type="number" placeholder="Total Amount" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
        <input type="text" placeholder="Transaction Ref" value={transactionRef} onChange={e => setTransactionRef(e.target.value)} />
        {/* ReceiptDetailsSubmission fields */}
        <input type="text" placeholder="OR Number" value={orNumber} onChange={e => setOrNumber(e.target.value)} />
        <input type="text" placeholder="Original Receipt" value={originalReceipt} onChange={e => setOriginalReceipt(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;