import { useState } from 'react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let newValue = 0;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let newValue = 0;

    switch (operation) {
      case '+':
        newValue = previousValue + inputValue;
        break;
      case '-':
        newValue = previousValue - inputValue;
        break;
      case '×':
        newValue = previousValue * inputValue;
        break;
      case '÷':
        newValue = previousValue / inputValue;
        break;
    }

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const Button = ({ 
    value, 
    onClick, 
    className = '' 
  }: { 
    value: string; 
    onClick: () => void; 
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-lg font-medium rounded-md transition-colors ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="flex flex-col h-full p-4 bg-win-surface">
      {/* Display */}
      <div className="mb-4">
        <div className="text-right text-sm text-muted-foreground h-6">
          {previousValue !== null && `${previousValue} ${operation}`}
        </div>
        <div className="text-right text-4xl font-light truncate">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1 flex-1">
        <Button value="%" onClick={percentage} className="bg-secondary hover:bg-muted" />
        <Button value="CE" onClick={clear} className="bg-secondary hover:bg-muted" />
        <Button value="C" onClick={clear} className="bg-secondary hover:bg-muted" />
        <Button value="⌫" onClick={() => setDisplay(display.slice(0, -1) || '0')} className="bg-secondary hover:bg-muted" />

        <Button value="1/x" onClick={() => setDisplay(String(1 / parseFloat(display)))} className="bg-secondary hover:bg-muted" />
        <Button value="x²" onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))} className="bg-secondary hover:bg-muted" />
        <Button value="√x" onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))} className="bg-secondary hover:bg-muted" />
        <Button value="÷" onClick={() => performOperation('÷')} className="bg-secondary hover:bg-muted" />

        <Button value="7" onClick={() => inputDigit('7')} className="bg-muted hover:bg-muted/80" />
        <Button value="8" onClick={() => inputDigit('8')} className="bg-muted hover:bg-muted/80" />
        <Button value="9" onClick={() => inputDigit('9')} className="bg-muted hover:bg-muted/80" />
        <Button value="×" onClick={() => performOperation('×')} className="bg-secondary hover:bg-muted" />

        <Button value="4" onClick={() => inputDigit('4')} className="bg-muted hover:bg-muted/80" />
        <Button value="5" onClick={() => inputDigit('5')} className="bg-muted hover:bg-muted/80" />
        <Button value="6" onClick={() => inputDigit('6')} className="bg-muted hover:bg-muted/80" />
        <Button value="-" onClick={() => performOperation('-')} className="bg-secondary hover:bg-muted" />

        <Button value="1" onClick={() => inputDigit('1')} className="bg-muted hover:bg-muted/80" />
        <Button value="2" onClick={() => inputDigit('2')} className="bg-muted hover:bg-muted/80" />
        <Button value="3" onClick={() => inputDigit('3')} className="bg-muted hover:bg-muted/80" />
        <Button value="+" onClick={() => performOperation('+')} className="bg-secondary hover:bg-muted" />

        <Button value="±" onClick={toggleSign} className="bg-muted hover:bg-muted/80" />
        <Button value="0" onClick={() => inputDigit('0')} className="bg-muted hover:bg-muted/80" />
        <Button value="." onClick={inputDecimal} className="bg-muted hover:bg-muted/80" />
        <Button value="=" onClick={calculate} className="bg-primary text-primary-foreground hover:bg-primary/90" />
      </div>
    </div>
  );
}
