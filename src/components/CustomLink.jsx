import Link from '@mui/material/Link';

export default function CustomLink({ href, children }) {
  return (
    <Link
      href={href}
      sx={{
        textDecoration: 'none',
        color: 'inherit', // Puedes cambiar 'inherit' a cualquier color que desees
        '&:hover': {
          color: 'primary.main', // Color cuando el enlace es seleccionado
        },
      }}
    >
      {children}
    </Link>
  );
}
