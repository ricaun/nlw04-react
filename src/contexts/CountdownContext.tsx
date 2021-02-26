
import { createContext, useState, ReactNode, useContext, useEffect} from 'react';
import { ChallengesContext } from './ChallengesContext';

let countdownTimeout: NodeJS.Timeout;

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinish: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({ children } : CountdownProviderProps) {
 
    const { startNewChallenge } = useContext(ChallengesContext);

    const startTimer = 3 + 0*60*25;
    const [time, setTime] = useState(startTimer);
    const [isActive, setIsActive] = useState(false);
    const [hasFinish, setHasFinish] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() {
        setIsActive(true);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinish(false);
        setTime(startTimer);
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time == 0) {
            setHasFinish(true);
            setIsActive(false);
            startNewChallenge();
        }

    }, [isActive, time])

    return (
      <CountdownContext.Provider 
        value={{
            minutes,
            seconds,
            hasFinish,
            isActive,
            startCountdown,
            resetCountdown,
        }}
      >
        {children}
      </CountdownContext.Provider>
    );
}