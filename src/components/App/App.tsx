import React, {useState} from "react";
import {Settings} from "../Settings/Settings";
import {Game} from "../Game/Game";

const AppWrapper = ({ children }: { children: React.ReactElement } ): JSX.Element => {
  return (
    <main>
      <h1>PL</h1>
      {children}
    </main>
  )
}

export const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <AppWrapper>
        <Settings
          startGame={setGameStarted}
        />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <Game />
    </AppWrapper>
  )
}
