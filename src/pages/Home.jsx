import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Form as BootstrapForm,
  Offcanvas,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Fungsi untuk format mata uang
const formatCurrency = (value) => {
  if (isNaN(value) || value === "") return "";
  return `Rp.${Number(value).toLocaleString("id-ID")}`;
};

// Fungsi untuk menghapus format mata uang dan mengkonversi ke angka
const parseCurrency = (value) => {
  if (typeof value !== "string") return 0;
  // Menghapus prefix dan pemisah ribuan
  const numericValue = value.replace(/[^0-9]/g, "");
  return parseInt(numericValue, 10) || 0;
};
const App = () => {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    gajipokok: "",
    tunjangan: "",
    jabatan: "",
    tanggalLahir: "",
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  // Effect untuk mengupdate form data berdasarkan karyawan yang dipilih
  useEffect(() => {
    const selectedEmployee = data.find((item) => item.name === selectedName);
    if (selectedEmployee) {
      setFormData({
        id: selectedEmployee.id,
        name: selectedEmployee.name,
        gajipokok: formatCurrency(selectedEmployee.gajipokok),
        tunjangan: formatCurrency(selectedEmployee.tunjangan),
        jabatan: selectedEmployee.jabatan,
        tanggalLahir: selectedEmployee.tanggalLahir,
      });
    } else {
      setFormData({
        id: null,
        name: "",
        gajipokok: "",
        tunjangan: "",
        jabatan: "",
        tanggalLahir: "",
      });
    }
  }, [selectedName, data]);

  // Hitung total gaji
  const getTotalSalary = () => {
    const selectedEmployee = data.find((item) => item.name === selectedName);
    if (selectedEmployee) {
      const totalSalary =
        parseCurrency(selectedEmployee.gajipokok) +
        parseCurrency(selectedEmployee.tunjangan);
      return formatCurrency(totalSalary);
    }
    return "Rp.0";
  };

  // Mengedit data karyawan
  const handleEdit = (item) => {
    setCurrentId(item.id);
    setFormData({
      id: item.id,
      name: item.name,
      gajipokok: formatCurrency(item.gajipokok),
      tunjangan: formatCurrency(item.tunjangan),
      jabatan: item.jabatan,
      tanggalLahir: item.tanggalLahir,
    });
  };

  // Menghapus data karyawan
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    alert("Data berhasil dihapus!");
  };

  // Mengirimkan data formulir
  const handleFormSubmit = (item) => {
    const parsedItem = {
      ...item,
      gajipokok: parseCurrency(item.gajipokok),
      tunjangan: parseCurrency(item.tunjangan),
    };

    if (item.id) {
      setData(data.map((d) => (d.id === item.id ? parsedItem : d)));
      alert("Data berhasil diperbarui!");
    } else {
      setData([...data, { ...parsedItem, id: data.length + 1 }]);
      alert("Data berhasil ditambahkan!");
    }

    setFormData({
      id: null,
      name: "",
      gajipokok: "",
      tunjangan: "",
      jabatan: "",
      tanggalLahir: "",
    });
    setCurrentId(null);
    setSelectedName("");
  };

  // Mengubah karyawan yang dipilih
  const handleNameChange = (e) => {
    setSelectedName(e.target.value);
  };

  return (
    <Container fluid>
      <Button onClick={() => setShowSidebar(true)} className="my-3">
        Open Sidebar
      </Button>
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
            <Nav.Link href="#help">Help</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <h1 className="my-4">Data Gaji Karyawan</h1>
      <BootstrapForm.Group controlId="formEmployeeSelect" className="my-1">
        <BootstrapForm.Label>Pilih Karyawan</BootstrapForm.Label>
        <BootstrapForm.Control
          as="select"
          onChange={handleNameChange}
          value={selectedName}
        >
          <option value="">Pilih Karyawan</option>
          {data.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </BootstrapForm.Control>
      </BootstrapForm.Group>
      <h2 className="my-4">
        Total Gaji untuk {selectedName || "karyawan"} akan dihitung saat Anda
        memilih karyawan.
      </h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Gaji Pokok</th>
            <th>Tunjangan</th>
            <th>Jabatan</th>
            <th>Tanggal Lahir</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{formatCurrency(item.gajipokok)}</td>
              <td>{formatCurrency(item.tunjangan)}</td>
              <td>{item.jabatan}</td>
              <td>{item.tanggalLahir}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(item)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Form data={formData} onFormSubmit={handleFormSubmit} />
    </Container>
  );
};

const Form = ({ data, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    gajipokok: "",
    tunjangan: "",
    jabatan: "",
    tanggalLahir: "",
  });

  // Effect untuk mengupdate formData
  useEffect(() => {
    setFormData({
      id: data.id || null,
      name: data.name || "",
      gajipokok: data.gajipokok ? formatCurrency(data.gajipokok) : "",
      tunjangan: data.tunjangan ? formatCurrency(data.tunjangan) : "",
      jabatan: data.jabatan || "",
      tanggalLahir: data.tanggalLahir || "",
    });
  }, [data]);

  // Mengubah data saat input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gajipokok" || name === "tunjangan") {
      const rawValue = parseCurrency(value);
      console.log(`handleChange - ${name} rawValue:`, rawValue); // Log nilai mentah
      setFormData({
        ...formData,
        [name]: formatCurrency(rawValue),
      });
    } else {
      console.log(`handleChange - ${name}:`, value); // Log nilai yang diubah
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Mengirimkan formulir
  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      // gajipokok: parseCurrency(formData.gajipokok),
      // tunjangan: parseCurrency(formData.tunjangan),
    };
    console.log("handleSubmit - submittedData:", submittedData); // Log data yang dikirim
    onFormSubmit(submittedData);
  };

  return (
    <Container className="my-4">
      <BootstrapForm onSubmit={handleSubmit}>
        <BootstrapForm.Group controlId="formName">
          <BootstrapForm.Label>Name</BootstrapForm.Label>
          <BootstrapForm.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama"
          />
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="formGajiPokok">
          <BootstrapForm.Label>Gaji Pokok</BootstrapForm.Label>
          <BootstrapForm.Control
            type="text"
            name="gajipokok"
            value={formData.gajipokok}
            onChange={handleChange}
            placeholder="Masukkan Gaji Pokok"
          />
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="formTunjangan">
          <BootstrapForm.Label>Tunjangan</BootstrapForm.Label>
          <BootstrapForm.Control
            type="text"
            name="tunjangan"
            value={formData.tunjangan}
            onChange={handleChange}
            placeholder="Masukkan Tunjangan"
          />
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="formJabatan">
          <BootstrapForm.Label>Jabatan</BootstrapForm.Label>
          <BootstrapForm.Control
            as="select"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
          >
            <option value="">Pilih jabatan</option>
            <option value="Admin">Admin</option>
            <option value="Programmer">Programmer</option>
          </BootstrapForm.Control>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="formTanggalLahir">
          <BootstrapForm.Label>Tanggal Lahir</BootstrapForm.Label>
          <BootstrapForm.Control
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
          />
        </BootstrapForm.Group>
        <Button variant="primary" type="submit">
          {formData.id ? "Update" : "Add"}
        </Button>
      </BootstrapForm>
    </Container>
  );
};

export default App;
