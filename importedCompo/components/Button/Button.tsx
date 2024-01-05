import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
interface PROPS {
  lable?: string;
  btnClases?: string;
  extras?: string;
  onCLick ?: () => void;
  loadings?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  laodingLable? : string;
  leftIcon?:any;
  rightIcon?:any;
}
const Button = ({ lable, btnClases, extras, onCLick, loadings,type, disabled, laodingLable, leftIcon, rightIcon }: PROPS) => {
  const className = btnClases || "linear w-full rounded-md bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-br  and-300 dark:active:opacity-90"
  return (
    <div className={extras} onClick={onCLick}>
      {loadings ?<div className='text-center w-full'><button type={type} className={`${className} flex items-center justify-center gap-x-1 w-[120px]`} disabled={disabled || loadings}>{laodingLable} <CircularProgress size="1rem" /> </button></div> : <button className={className}>{leftIcon}{lable} {rightIcon}</button>}
    </div>
  )
}

export default Button

export function CircularIndeterminate() {
  return (
      <CircularProgress size="10rem" style={{padding:"100px"}}/>
  );
}