import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import { Alert, Card as MuiCard } from '@mui/material'
import Box from '@mui/material/Box'
import LockIcon from '@mui/icons-material/Lock'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useForm } from 'react-hook-form'

import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validator'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'

import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUserAPI } from '~/redux/user/userSlice'
function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogin = (data) => {
    const { email, password } = data
    toast.promise(dispatch(loginUserAPI({ email, password })), { pending: 'Logging in...' }).then((res) => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogin)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em'
            }}
          >
            {verifiedEmail && (
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  {verifiedEmail}
                </Typography>
                &nbsp; has been verified. <br /> Now you can login to access our services
              </Alert>
            )}
            {registeredEmail && (
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>
                  {registeredEmail}
                </Typography>
                &nbsp; has been verified. <br /> Please check and verify your account before logging in
              </Alert>
            )}
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']} //check if errors['email'] is not empty
              />

              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors['password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button className="intercepter-loading" fullWidth variant="contained" color="primary" size="large" type="submit">
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don’t have an account?{' '}
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'primary.main',
                  '&:hover': { color: '#ffbb39' },
                  cursor: 'pointer'
                }}
              >
                Register
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}
export default LoginForm
