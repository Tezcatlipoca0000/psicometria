"use client";

import { useState } from "react";
import { useEffect } from "react";
import test from "@/app/tests/1.json";

export default function DepresionTest1() {
  const [display, setDisplay] = useState(false);
  const [question, setQuestion] = useState(0);
  const [client, setClient] = useState({});
  const [last, setLast] = useState(false);
  const [results, setResults] = useState([]); // maybe use for later

  useEffect(()=>{
    if (last) processResults();
  }, [client, last]);

  function openTest() {
    setLast(false);
    setClient({});
    setDisplay(!display);
    setQuestion(0);
  }

  function slideNext() {
    if (question < test.questions.length - 1) setQuestion(question + 1);
  }

  function registerAnswer(answerIdx) {
    let newClient = {...client};
    newClient[`${question}`] = answerIdx;
    setClient(newClient);
    slideNext();
    if (question === test.questions.length -1) setLast(true);
  }

  function processResults() {
    let score = [],
        clientSyntoms = {...test.syntoms},
        newResults = [...results];
    Object.keys(client).forEach(e => score.push(test.scores[e][client[e]]) );
    let sumScore = score.reduce((a,b) => a + b, 0),
        scoreIndex = Math.round((sumScore * 100) / 80);
    newResults.push(`Puntajes del paciente por pregunta: ${score}\nPuntaje total del paciente: ${sumScore}\nIndice de Valoración de la Depresión: ${scoreIndex}\nDiagnostico:`);
    if (scoreIndex <= 40) {
      newResults.push(test.interpretation.lt40.dx);
      newResults.push(test.interpretation.lt40.meaning);
    } else if (scoreIndex <= 60) {
      newResults.push(test.interpretation["41-60"].dx);
      newResults.push(test.interpretation["41-60"].meaning);
    } else if (scoreIndex <= 70) {
      newResults.push(test.interpretation["61-70"].dx);
      newResults.push(test.interpretation["61-70"].meaning);
    } else {
      newResults.push(test.interpretation.gt70.dx);
      newResults.push(test.interpretation.gt70.meaning);
    }
    newResults.push("Resultados de las 4 dimensiones importantes de la depresión:");
    let valorationReport = {"altos": ["un puntaje alto en los siguientes aspectos o desordenes:"], "bajos": ["Y un puntaje bajo en los siguientes aspectos o desordenes:"]};
    Object.keys(test.syntoms).forEach((k) => {
        newResults.push(` -- ${k}:`);
        let syntomScore = [];
        Object.keys(test.syntoms[k]).forEach((e) => {
            let clientScore = score[test.syntoms[k][e] - 1];
            syntomScore.push(clientScore);
            clientSyntoms[k][e] = clientScore;
            if (clientScore > 2) {
                valorationReport.altos.push(` -- ${e}`);
            } else {
                valorationReport.bajos.push(` -- ${e}`);
            }
        });
        let syntomSum = syntomScore.reduce((a,b) => a+b, 0),
            syntomValoration = syntomSum >= (4 * syntomScore.length) / 2 ? "alto" : "moderado a bajo";
        newResults.push(`${syntomSum} De: ${4 * syntomScore.length} ---- ${syntomValoration}`);
    });
    newResults.push(`Tabla de puntajes por ítems:`);
    newResults.push(JSON.stringify(clientSyntoms, null, 2));
    newResults.push(`En resumen: El paciente presenta `);
    console.log("Imprimiendo resultados....\n\n");
    newResults.forEach((e) => console.log(e));
    valorationReport.altos.forEach((e) => console.log(e));
    valorationReport.bajos.forEach((e) => console.log(e));
  }

  const answersComponent = test.answers.map((value, idx) => {
    return (
        <button key={`answer_idx`} onClick={()=>registerAnswer(idx)} className="border rounded-full ml-4 p-2">
            {test.answers[idx]}
        </button>
    );
  });

  return (
    
    <>
      <button onClick={openTest}>
        {`${test.name}`}
      </button>
      <div className={`${display ? 'block' : 'hidden'} w-2/3 h-3/4 bg-white border-1 border-gray-400 rounded-md fixed top-[12.5%] left-[16.5%] z-50 shadow-2xl drop-shadow-2xl flex justify-center items-center flex-col`}>
        <div> {/*Maybe make this div display?block:hidden as well. ofc diff variable that displays the test and have another div with block:hidden that displays the instructions before and another at the end that displays the results all inside the above block:hidden. Maybe give the fade out-in effect to the other divs as if text appears-dissapears inside the card (container div)*/}
          <button onClick={openTest}>
            Close
          </button>
        </div>
        <div>
          {test.questions[question]}
        </div>
        <div className="flex justify-evenly">
          {answersComponent}
        </div>
        <div>
          <button onClick={slideNext}>
            Next
          </button>
        </div>
      </div>
    </>
        
  );
}
