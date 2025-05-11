import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Link } from 'react-router-dom'
import image from '~/assets/404/error-2129569__340.jpg'

export function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Link to="/">
              <Button variant="contained">Back Home</Button>
            </Link>
          </Grid>
          <Grid item xs={6}>
            <img src={image} alt="404" width={500} height={250} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
