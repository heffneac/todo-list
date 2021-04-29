import { Button } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import './App.css';

interface TodoItem {
  name: string;
  completed: boolean;
}

interface FormData {
  name: string;
}

const App = () => {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [open, setOpen] = useState(false);
  const { handleSubmit, register, reset, formState } = useForm<FormData>({
    mode: "onChange",
  });

  useEffect(() => {
    loadItemsFromLocalStorage();
  }, []);

  const loadItemsFromLocalStorage = () => {
    setItems(getItemsFromLocalStorage());
  };

  const getItemsFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("items") as string) as TodoItem[] ?? [];
  }

  const updateLocalStorage = (items: TodoItem[]) => {
    localStorage.setItem("items", JSON.stringify(items));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = handleSubmit(({name}) => {
    const newItems = [...items, { name: name, completed: false }];
    setItems(newItems);
    updateLocalStorage(newItems);
    reset();
    handleClose();
  });

  const markCommpleted = (index: number) => {
    let newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
    updateLocalStorage(newItems);
  };

  const deleteItem = (index: number) => {
    let newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    updateLocalStorage(newItems);
  }

  const updateSearch = async (input: string) => {
    if (input.length === 0) {
      loadItemsFromLocalStorage();
    }
    else {
      const filteredItems = getItemsFromLocalStorage().filter((item) => {
        return item.name.toLowerCase().includes(input.toLowerCase());
      });
      setItems(filteredItems);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="header-actions">
        <TextField
          data-testid="search-bar"
          label="Search"
          variant="outlined"
          className="search-bar"
          onChange={(e) => updateSearch(e.target.value as string)}
        />
        <Button
          onClick={handleOpen}
          color="primary"
          size="large"
          variant="contained"
          className="add-btn"
        >
          Add Item
        </Button>
      </div>
      {items.length > 0 ? (
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" className="completed">
                  Completed
                </TableCell>
                <TableCell className="name">Name</TableCell>
                <TableCell className="delete" align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    <Checkbox
                      checked={item.completed}
                      onChange={() => markCommpleted(index)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">
                    <Button
                      color="secondary"
                      onClick={() => deleteItem(index)}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="no-items">No Items</div>
      )}

      <Modal open={open} onClose={handleClose}>
        {
          <div className="modal-container">
            <h1>Add Item</h1>
            <form onSubmit={onSubmit}>
              <TextField
                data-testid="name"
                label="Todo Item Name"
                variant="outlined"
                className="item-name"
                {...register("name", { required: true })}
              />
              <div className="actions">
                <Button
                  data-testid="add"
                  disabled={!formState.isValid}
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  Add
                </Button>
                <Button
                  onClick={handleClose}
                  variant="contained"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        }
      </Modal>
    </div>
  );
}

export default App;
