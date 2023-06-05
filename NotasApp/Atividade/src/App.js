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
      const filteredNotes = originalNotes.filter(note => {
        if (importance === 'all') {
          return note;
        } else {
          return note.importance === Number(importance);
        }
      });
      const sortedNotes = filteredNotes.sort((a, b) => a.id - b.id);
      setNotes(sortedNotes);
      setSuccessMessage(`Notas filtradas por importância ${importance}.`);

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao filtrar as notas por importância.');
    }
  };

  const deleteNote = async noteId => {
    try {
      const response = await axios.delete(`http://localhost:3001/posts/${noteId}`);

      if (response.status === 200) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        setOriginalNotes(updatedNotes);
        setSuccessMessage('Nota excluída com sucesso!');

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage('Ocorreu um erro ao excluir a nota.');
      }
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao excluir a nota.');
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
            { key: 'all', value: 'all', text: 'Todas as importâncias' },
          ]}
          className="importance-select"
        />
        <Button onClick={addNote} className="add-note-button green">Adicionar</Button>
      </div>
      <Button onClick={() => filterByImportance('1')} className="filter-button blue">
        Filtrar por Importância 1
      </Button>
      <Button onClick={() => filterByImportance('2')} className="filter-button blue">
        Filtrar por Importância 2
      </Button>
      <Button onClick={() => filterByImportance('3')} className="filter-button blue">
        Filtrar por Importância 3
      </Button>
      <Button onClick={() => filterByImportance('0')} className="filter-button blue">
        Filtrar por Sem Importância
      </Button>
      <List className="note-list">
        {notes.map((note) => (
          <List.Item key={note.id} className="note-item">
            <span>{note.text}</span>
            <Button
              icon="trash"
              color="red"
              onClick={() => deleteNote(note.id)}
            />
          </List.Item>
        ))}
      </List>
    </Container>
  );
};

export default NotepadApp;