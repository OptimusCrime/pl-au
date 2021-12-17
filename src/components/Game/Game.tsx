import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../store/hooks";

import './game.scss';
import {PlayerData, TeamData} from "../../types";
import {shuffleArray} from "../../utilities";

const constructOptions = (currentPlayer: PlayerData, selectedPlayers: PlayerData[], options: number) => {
  const selectedPlayersWithoutCurrentPlayer =
    shuffleArray(
      selectedPlayers
        .filter(player => player.id !== currentPlayer.id)
    ).slice(0, options - 1);

  return shuffleArray([
    currentPlayer,
    ...selectedPlayersWithoutCurrentPlayer
  ]);
}

const findTeam = (player: PlayerData, teams: TeamData[]): string =>
  teams.find(team => team.id === player.team)?.name || "Unknown";

const getName = (player: PlayerData): string => `${player.firstName} ${player.lastName}`;

export const Game = () => {
  const globalState = useAppSelector(state => state);
  const {settings, players} = globalState;
  const teams = globalState.teams.teams;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questionState, setQuestionState] = useState({
    guessed: false,
    correct: false,
    points: 0
  });

  const currentPlayer = players.selectedPlayers[currentQuestion] || players.selectedPlayers[currentQuestion - 1];
  const {showInformation, optionsInformation} = settings;
  const [options, setOptions] = useState(
    constructOptions(currentPlayer, players.selectedPlayers, settings.options)
  );

  useEffect(() => {
    setOptions(
      constructOptions(currentPlayer, players.selectedPlayers, settings.options)
    );
  }, [currentQuestion]);

  if (players.selectedPlayers.length === currentQuestion + 1) {
    return (
      <>
        <h1>Game complete</h1>
        <p>You got {questionState.points} points of {players.selectedPlayers.length}!</p>
        <button
          onClick={() => {
            window.location.reload();
          }}
        >
          Play again
        </button>
      </>
    );
  }

  return (
    <div className="game">
      <>
        <div className="game-question">
          <div>
            <h2>Question {currentQuestion + 1} of {players.selectedPlayers.length}</h2>
          </div>
          <div>
            <h2>
              Points: {questionState.points}
            </h2>
          </div>
          <div
            className="next-question"
            style={{ visibility: questionState.guessed ? 'visible' : 'hidden'}}
          >
            <button
              onClick={() => {
                setQuestionState(currentQuestionState => ({
                  ...currentQuestionState,
                  guessed: false,
                  correct: false,
                }));
                setCurrentQuestion(currentQuestionFoo => currentQuestionFoo + 1);
              }}
            >
              Next question
            </button>
          </div>
        </div>
        <div className="game-information">
          {showInformation.picture && (
            <div className="player-image">
              <img src={currentPlayer.picture} alt="Guess who"/>
            </div>
          )}
          <div className="game-information-text">
            <ul>
              <li><strong>Name</strong>: {showInformation.name ? getName(currentPlayer) : '<REDACTED>'}</li>
              <li><strong>Shirt number</strong>: {showInformation.shirtNumber ? currentPlayer.shirtNum : '<REDACTED>'}
              </li>
              <li><strong>Team</strong>: {showInformation.team ? findTeam(currentPlayer, teams) : '<REDACTED>'}</li>
              <li><strong>Position</strong>: {showInformation.position ? currentPlayer.position : '<REDACTED>'}</li>
            </ul>
          </div>
        </div>
        <div className="game-options">
          {options.map((optionPlayer, index) => {
            const classNames = ['game-option'];

            if (questionState.guessed) {
              if (questionState.correct && currentPlayer.id === optionPlayer.id) {
                classNames.push('correct');
              }
              else if (!questionState.correct && currentPlayer.id === optionPlayer.id) {
                classNames.push('wrong');
              }
            }

            return (
              <div
                key={optionPlayer.id}
                className={classNames.join(' ')}
                onClick={() => {
                  if (!questionState.guessed) {
                    const correct = optionPlayer.id === currentPlayer.id;
                    setQuestionState(currentQuestionState => ({
                      guessed: true,
                      correct,
                      points: correct ? currentQuestionState.points + 1 : currentQuestionState.points
                    }))
                  }
                  else {
                    // Because lazy people
                    setQuestionState(currentQuestionState => ({
                      ...currentQuestionState,
                      guessed: false,
                      correct: false,
                    }));
                    setCurrentQuestion(currentQuestionFoo => currentQuestionFoo + 1);
                  }
                }}
              >
                {optionsInformation.picture && (
                  <div className="player-image">
                    <img src={optionPlayer.picture} alt="Guess who"/>
                  </div>
                )}
                <div className="option-information-text">
                  <ul>
                    {optionsInformation.name && (<li><strong>Name</strong>: {getName(optionPlayer)}</li>)}
                    {optionsInformation.shirtNumber && (<li><strong>Shirt number</strong>: {optionPlayer.shirtNum}</li>)}
                    {optionsInformation.team && (<li><strong>Team</strong>: {findTeam(optionPlayer, teams)}</li>)}
                    {optionsInformation.position && (<li><strong>Position</strong>: {optionPlayer.position}</li>)}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </>
    </div>
  )
};
