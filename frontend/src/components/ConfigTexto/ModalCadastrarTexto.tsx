import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoTexto from "./InfoTexto";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1100,
  height: 580,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
};

export default function ModalCadastrarTexto() {
  const [error, setError] = useState(null);

  const [content, setContent] = useState({
    nome: "",
    tipo: "Email",
    conteudo: "",
  });

  function limparFormulario() {
    setContent({
      nome: "",
      tipo: "Email",
      conteudo: "",
    });
  }

  const onChangeInput = (e: any) =>
    setContent({ ...content, [e.target.name]: e.target.value });

  const cadastrarTexto = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3333/textos", {
        method: "POST",
        body: JSON.stringify(content),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 500) {
        setError("Texto com este nome já cadastrado");
      } else if (response.ok) {
        handleClose();
        limparFormulario();
        location.reload();
      }
    } catch (err) {
      console.log("Erro ao cadastrar texto:", err);
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      {error && (
        <Alert
          className="z-50 absolute bottom-2 right-0"
          severity="error"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              <CloseIcon />
            </Button>
          }
          onClose={() => setError(null)}
        >
          <AlertTitle className="font-bold">Erro</AlertTitle>
          {error}
        </Alert>
      )}
      <Button
        className="m-5 p-5 justify-center uppercase bg-[var(--primary-color)] hover:bg-slate-900 text-l font-bold"
        variant="contained"
        onClick={handleOpen}
      >
        Cadastrar Texto
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose();
          limparFormulario();
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <text className="mt-3 mb-3 text-2xl font-bold">
              Cadastrar Texto
            </text>
            <p className="mt-5 mb-5 font-bold">
              Insira os dados do texto para cadastrar
            </p>

            <form onSubmit={cadastrarTexto} id="form">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-gray-400"
                  onChange={onChangeInput}
                  value={content.nome}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-gray-400"
                  onChange={onChangeInput}
                  value={content.tipo}
                  required
                >
                  <option value="Email">Email</option>
                  <option value="Ata">Ata</option>
                  <option value="Declaracao">Declaração</option>
                </select>
              </div>
              <div className="mb-4">
                
                <div className="relative">
                  <InfoTexto className="absolute top-0 left-0 mb-4" />

                  <textarea
                    id="conteudo"
                    name="conteudo"
                    rows="5"
                    className="w-full h-1/3 resize-none border border-gray-300 px-3 py-2 rounded-md focus:ring focus:ring-gray-400"
                    onChange={onChangeInput}
                    value={content.conteudo}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                className="mt-3 uppercase bg-[var(--primary-color)] hover:bg-slate-900 float-right bottom-0 right-0"
              >
                Cadastrar
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
