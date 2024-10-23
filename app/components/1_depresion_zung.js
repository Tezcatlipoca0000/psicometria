"use client";

import { useState } from "react";
import { useEffect } from "react";
import test from "@/app/tests/1.json";
import { UUID } from "uuidjs";
import Link from "next/link";

export default function DepresionTest1() {
  const [display, setDisplay] = useState(false);
  const [question, setQuestion] = useState(0);
  const [client, setClient] = useState({});
  const [last, setLast] = useState(false);
  const [results, setResults] = useState([]); 
  const [startDescription, setStartDescription] = useState(true);
  const [startInstructions, setStartInstructions] = useState(false);
  const [startApplication, setStartApplication] = useState(false);
  const [applicationURL, setApplicationURL] = useState({});
  const [startTest, setStartTest] = useState(false);
  const [startResults, setStartResults] = useState(false);

  useEffect(()=>{
    if (last) processResults();
  }, [client, last]);

  function openTest() {
    setStartInstructions(false);
    setStartApplication(false);
    setApplicationURL({});
    setStartTest(false);
    setStartResults(false);
    setLast(false);
    setClient({});
    setDisplay(!display);
    setQuestion(0);
    if (display) setStartDescription(true);
  }

  function slideNext() {
    if (question < test.questions.length - 1) setQuestion(question + 1);
  }

  function registerAnswer(answerIdx) {
    let newClient = {...client};
    newClient[`${question}`] = answerIdx;
    setClient(newClient);
    if (question === test.questions.length -1) {
      setLast(true);
    } else {
      slideNext();
    }
  }

  function processResults() {
    setStartTest(false);
    setStartResults(true);
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
    valorationReport.altos.forEach((e) => newResults.push(e));
    valorationReport.bajos.forEach((e) => newResults.push(e));
    setResults(newResults);
  }

  const answersComponent = test.answers.map((value, idx) => {
    return (
        <button key={`answer_${idx}`} onClick={()=>registerAnswer(idx)} className="border rounded-full ml-4 p-2">
            {test.answers[idx]}
        </button>
    );
  });

  function generateApplication(event) {
    event.preventDefault();
    let clientURL = "/resultados/",
        uniqueId = UUID.generate(),
        newApplicationURL = {...applicationURL},
        num = event.target.applicationNum.value;
    
    newApplicationURL["client"] = <Link href={`${clientURL}${uniqueId}`} target="_blank" className="overflow-x-auto bg-gray-400 my-1">{`${clientURL}${uniqueId}`}</Link>;
    newApplicationURL["subject"] = [];
    
    for (let i = 0; i < num; i++) {
      let uniqueId = UUID.generate(),
          expirationTime = new Date(),
          subjectURL = "/prueba/";
      expirationTime.setTime(expirationTime.getTime() + (3600000 * 24));
      newApplicationURL["subject"].push(<Link key={`subject-${i}`} href={`${subjectURL}${uniqueId}`} target="_blank" className="overflow-x-auto bg-gray-400 my-1">{`${subjectURL}${uniqueId}`}</Link>);
    }
    
    setApplicationURL(newApplicationURL);
  }

  return (
    
    <>
      <button onClick={openTest}>
        {`${test.name}`}
      </button>
      <div className={`${display ? 'block' : 'hidden'} w-2/3 h-3/4 bg-white border-1 border-gray-400 rounded-md fixed top-[12.5%] left-[16.5%] z-50 shadow-2xl drop-shadow-2xl`}>

        {/* Test Description */}
        <div className={`${startDescription ? 'block' : 'hidden'} flex flex-col w-full h-full`}>
          <div className={`w-full flex justify-start m-2 p-2`}> 
            <button onClick={openTest}>
              Close
            </button>
          </div>
          <div className="p-2 m-2 overflow-y-auto ">
            <h2 className="text-center">
              {test.name}
            </h2>
            <p>
              {test.description}
            </p>
            <p>
              {test.functioning}
            </p>
            <p>
              {test.advantajes}
            </p>
            <p>
              {test.limitations}
            </p>
          </div>
          <div className="flex justify-evenly p-4">
            <button onClick={() => {setStartDescription(false); setStartInstructions(true);}} className="border rounded-full ml-4 p-2">
              Auto-Aplicación
            </button>
            <button onClick={() => {setStartDescription(false); setStartApplication(true);}} className="border rounded-full ml-4 p-2"> 
              Aplicación Individual / Grupal {/* Give URL's /prueba/[id] for participants */}
            </button>
          </div>
        </div>

        {/* Test Instructions */}
        <div className={`${startInstructions ? 'block' : 'hidden'}`}>
          <div className={`w-full flex justify-start m-2 p-2 max-h-fit`}> 
            <button onClick={openTest}>
              Close
            </button>
          </div>
          <div>
            <p>
              {test.instructions}
            </p>
          </div>
          <div className="flex justify-evenly p-4">
            <button onClick={() => {setStartInstructions(false); setStartTest(true);}} className="border rounded-full ml-4 p-2">
              Comenzar
            </button>
          </div>
        </div>

        {/* Test Application */}
        <div className={`${startApplication ? 'block' : 'hidden'}`}>
          <div className={`w-full flex justify-start m-2 p-2 max-h-fit`}> 
            <button onClick={openTest}>
              Close
            </button>
          </div>
          <form className="w-full flex justify-evenly" onSubmit={generateApplication}>
            <label>
              Ingrese el número de aplicantes: 
            </label>
            <input id="applicationNum" name="applicationNum" className="border" type="number" min={1} step={1} max={120} required />
            <button type="submit">
              Generar
            </button>
          </form>
          <div className={`${applicationURL["client"] ? 'block' : 'hidden'} flex flex-col`}>
            <label>
              URL del Aplicador:
            </label>
            <div>
              {applicationURL["client"]}
            </div>
            <label>
              URL de los sujetos:
            </label>
            <div className="flex flex-col overflow-y-auto">
              {applicationURL["subject"]}
            </div>
          </div>
        </div>

        {/* Test Questions */}
        <div className={`${startTest ? 'block' : 'hidden'}`}>
          <div className={`w-full flex justify-start m-2 p-2 max-h-fit`}> 
            <button onClick={openTest}>
              Close
            </button>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            {test.questions[question]}
          </div>
          <div className="flex justify-evenly mb-12">
            {answersComponent}
          </div>
        </div>

        {/* Test Results --Pending */}
        <div className={`${startResults ? 'block' : 'hidden'} overflow-y-auto`}>
        <div className={`w-full flex justify-start m-2 p-2 max-h-fit`}> 
            <button onClick={openTest}>
              Close
            </button>
          </div>
          <p>
            {JSON.stringify(results)}
          </p>
        </div>

      </div>
    </>
        
  );
}

/*
MAYBE
move the description and application back to testList 
leave instructions, questions and results here
import this component (1_dep....js) to /prueba/[id]
from page.js import test from "@/app/tests/1.json" and pass test as props to testList and 1_dep..

TODO
create the database 
ex:
{
  "a1b2c3d4": {
    "test": 1,
    "subjects": {
      "1a2b3c4d": [results go here]
    }
  }
}
ex:
TABLE clients(key, test, subjectkey)
TABLE subjects(key, clientKey, results)

re-render /resultados/[id] when pushing results to DB

*/