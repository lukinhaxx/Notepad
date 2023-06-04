import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Container, Header, Input, Select, Button, Message, List } from 'semantic-ui-react';

const NotepadApp = () => {
  const [notes, setNotes] = useState([]);
  const [originalNotes, setOriginalNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [importance, setImportance] = useState('0');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts');
      const filteredNotes = response.data.filter(item => item.text);
      setNotes(filteredNotes);
      setOriginalNotes(filteredNotes);
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao buscar as notas.');
    }
  };

  const addNote = async () => {
    try {
      const newNoteObject = {
        text: newNote,
        importance: Number(importance)
      };

      const response = await axios.post('http://localhost:3001/posts', newNoteObject);

      if (response.status === 201) {
        const updatedNotes = [...notes, { ...response.data, importance: Number(importance) }];
        setNotes(updatedNotes);
        setOriginalNotes(updatedNotes);
        setNewNote('');
        setSuccessMessage('Nota salva com sucesso!');

        // Limpar mensagem de sucesso após 5 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage('Ocorreu um erro ao salvar a nota.');
      }
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao salvar a nota.');
    }
  };

  const filterByImportance = importance => {
    try {
      const filteredNotes = originalNotes.filter(note => note.importance === importance);
      const sortedNotes = filteredNotes.sort((a, b) => a.id - b.id);
      setNotes(sortedNotes);
      setSuccessMessage(`Notas filtradas por importância ${importance}.`);

      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao filtrar as notas por importância.');
    }
  };

  return (
    <Container>
      {errorMessage && <Message negative>{errorMessage}</Message>}
      {successMessage && <Message positive>{successMessage}</Message>}
      <Header as="h1" className="notepad-title">Notepad App</Header>
      <div className="note-input-container">
        <Input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Digite uma nova nota"
          className="note-input"
        />
        <Select
          value={importance}
          onChange={(e, { value }) => setImportance(value)}
          options={[
            { key: '0', value: '0', text: 'Sem importância' },
            { key: '1', value: '1', text: 'Importância 1' },
            { key: '2', value: '2', text: 'Importância 2' },
            { key: '3', value: '3', text: 'Importância 3' },
          ]}
          className="importance-select"
        />
        <Button onClick={addNote} className="add-note-button green">Adicionar</Button>
      </div>
      <Button onClick={() => filterByImportance(1)} className="filter-button blue">
        Filtrar por Importância 1
      </Button>
      <Button onClick={() => filterByImportance(0)} className="filter-button blue">
        Desfiltrar
      </Button>
      <List className="note-list">
        {notes.map((note) => (
          <List.Item key={note.id} className="note-item">
            <span>{note.text}</span>
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default NotepadApp;
