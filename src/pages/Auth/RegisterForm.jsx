//authentication signin sigup
import Zoom from '@mui/material/Zoom'
import Avatar from '@mui/material/Avatar'
import { Card as MuiCard } from '@mui/material'
import Box from '@mui/material/Box'
import LockIcon from '@mui/icons-material/Lock'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'

import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validator'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { toast } from 'react-toastify'
import { registerUserAPI } from '~/apis'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const navigate = useNavigate()

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(registerUserAPI({ email, password }), { pending: 'Registration is in progress...' }).then((user) => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
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
          {/* <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '0 1em'
            }}
          >
            <Alert
              severity="success"
              sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
            >
              Your email&nbsp;
              <Typography
                variant="span"
                sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
              ></Typography>
            </Alert>
          </Box> */}
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
                error={!!errors['email']}
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

            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                variant="outlined"
                error={!!errors['passwordConfirmation']}
                {...register('passwordConfirmation', {
                  validate: (value) => {
                    if (value === watch('password')) return true
                    return 'Password confirmation does not match'
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'passwordConfirmation'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button className="intercepter-loading" fullWidth variant="contained" color="primary" size="large" type="submit">
              Register
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Already have an account?{' '}
            </Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'primary.main',
                  '&:hover': { color: '#ffbb39' },
                  cursor: 'pointer'
                }}
              >
                Log in
              </Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}
export default RegisterForm
