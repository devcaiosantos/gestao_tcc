"use client";
import { Alert, AlertTitle, Box, Checkbox } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import { workspaceService } from "@/components/Workspace";
import { useRouter } from "next/navigation";

export default function DefinirOrientador() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const urlRA = `http://localhost:3333/alunoAuth/ra-token/${token}`;
  const linkAddProfessor = `/aluno/RequisitarProfessor?token=${token}`;

  const [aluno, setAluno] = useState(null);
  const [professor, setProfessores] = useState(null);
  const [tccAluno, setTCC] = useState(null);
  const [orientador, setOrientador] = useState("");
  const [coorientador, setCoorientador] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(0);
  const [possuiCoorientador, setPossuiCoorientador] = useState(false);

  const handleChange1 = (event: ChangeEvent<HTMLInputElement>) => {
    setOrientador(event.target.value as string);
  };

  const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    setCoorientador(event.target.value as string);
  };



  useEffect(() => {
    const fetchData = async () => {
      const workspaceValue = await workspaceService.getWorkspace();
      setValue(workspaceValue);
      const ra = await axios.get(urlRA);
      const urlAluno = `http://localhost:3333/alunos/${ra.data.ra}`;
      const alunos = await axios.get(urlAluno);
      setAluno(alunos.data);
      const urlProfessor = `http://localhost:3333/professores`;
      const professor = await axios.get(urlProfessor);
      setProfessores(professor.data);

      const urlTCC = `http://localhost:3333/tcc/${alunos.data.ra}/${value.ativo}`;
      const tccs = await axios.get(urlTCC);
      setTCC(tccs.data[0]);
    };

    fetchData();
  }, [urlRA, value.ativo]);

  useEffect(() => {
    if(!possuiCoorientador){
      setCoorientador("");      
    }
  }, [possuiCoorientador]);

  const handleSubmit = async () => {
    if (orientador === "") {
      setError("Campo orientador vazio");
      return;
    }
    if (orientador == coorientador) {
      setError("Orientador igual a coorientador");
      return;
    }
    if (tccAluno) {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3333/tcc/${tccAluno.id}`, {
        method: "PUT",
        body: JSON.stringify({
          etapa: "TCC1",
          titulo: "",
          orientador_id: parseInt(orientador),
          coorientador_id: parseInt(coorientador),
          status: "Orientador_Definido",
        }),
        headers: { "Content-Type": "application/json" },
      });
      await fetch("http://localhost:3333/historico", {
        method: "POST",
        body: JSON.stringify({
          aluno: parseInt(aluno.ra),
          workspace: parseInt(value.ativo),
          Etapa: "TCC1",
          orientador: parseInt(orientador),
          status_processo: "Orientador_Definido",
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setIsLoading(false);
        router.push(`/aluno/DadosConfirmados?token=${token}`);
      } else {
        setError("Erro ao editar o campo");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
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
      <Box className="bg-[var(--background-color)] w-[70%] top-1/3 rounded-lg p-10 absolute t-1/2 shadow-lg shadow-black">
        {aluno && (
          <p className="font-semibold text-[var(--third-color)] text-3xl">
            Olá {aluno.nome}
          </p>
        )}
        <br />
        <p className="font-semibold text-[var(--third-color)] text-xl">
          Informe seu orientador de TCC
        </p>
        <div style={{
          width: "100%",
          marginTop: "20px"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column"
          }}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBottom: "5px"
              }}
            >
              Orientador
            </label>
            <select
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px"
              }}
              value={orientador}
              onChange={handleChange1}
            >
              <option value={0}>Selecione um orientador</option>
              {professor &&
                professor.map((prof: any, index:number) =>{
                  if(prof.departamento == "DACOM"){
                    return <option key={index} value={prof.id}>{prof.nome}</option>
                  }
                } 
              )}
            </select>
          </div>
        
          <div style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "1.0rem",
                marginBottom: "5px"
              }}
            >
              Possui coorientador?
            </label>
            <input 
              type="checkbox"
              style={{
                transform: "scale(1.2)",
                marginLeft: "10px"
              }}
              onChange={() => setPossuiCoorientador(!possuiCoorientador)}
              checked={possuiCoorientador}
            />
          </div>
          {
            possuiCoorientador
            &&
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              <label 
                style={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  marginBottom: "5px"
                }}
              >
                Coorientador
              </label>
              <select
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px"
                }}
                value={coorientador}
                onChange={handleChange2}
              >
                <option value={0}>Selecione um orientador</option>
                {professor &&
                  professor.map((prof: any, index:number) =>{
                    if(prof.departamento == "DACOM"){
                      return <option key={index} value={prof.id}>{prof.nome}</option>
                    }
                  } 
                )}
              </select>
            </div>
          }
          <div className="inline">
            <Button
              href={linkAddProfessor}
              variant="contained"
              className="font-medium h-14 w-auto mt-8 bg-[var(--primary-color)] hover:bg-slate-900"
            >
              MEU PROFESSOR NÃO ESTÁ NA LISTA
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="font-medium h-14 w-auto mt-8 bg-[var(--primary-color)] hover:bg-slate-900 float-right"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "CARREGANDO..." : "  CONFIRMAR  "}
            </Button>
          </div>    
        </div>
      </Box>
    </>
  );
}
