import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { AvatarGroup } from '@mui/material';
interface Props{
    children: string | JSX.Element[]| undefined | React.ReactNode;
}

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}
export const hex2rgb = (hex: string, opacity:string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 'rgba('+r+','+g+','+b+','+opacity+')'
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name.split(' ')[1]?`${name.split(' ')[0][0]}${name.split(' ')[1][0]}`:`${name.split(' ')[0][0]}`,
  };
}

export default function BackgroundLetterAvatars(props:Props) {
  return (
    <AvatarGroup max={6}>
      {props.children}
    </AvatarGroup>
  );
}
