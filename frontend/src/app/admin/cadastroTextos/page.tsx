"use client";
import LinhaTexto from "@/components/ConfigTexto/LinhaTexto";
import ModalCadastrarTexto from "@/components/ConfigTexto/ModalCadastrarTexto";
import { Box } from "@mui/material";

import React, { useEffect, useState } from "react";

export default function cadastroTexto() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333/textos");
        if (!response.ok) {
          throw new Error("Erro ao buscar dados da API");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <text className="text-2xl font-bold">Cadastrar Texto</text>
      <div className="p-6 flex flex-col items-center justify-center">
    <ModalCadastrarTexto/>
        <div className="mt-5 w-10/12">
        <div className="px-16 mb-2 flex font-extrabold justify-between">
          <text>Nome</text>
          <text>Tipo</text>
          <text>Ações</text>
        </div>
          {data ? (
            data.map((texto: any) =>
                <LinhaTexto 
                  nome={texto.nome}
                  tipo={texto.tipo}
                  conteudo={texto.conteudo}
                />
              )
          ) : (
            <></>
          )}
        </div>
      </div>
    </Box>
  );
}
