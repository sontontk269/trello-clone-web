import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

function AutoCompleteSearchBoard() {
  const navigate = useNavigate()

  // State xử lý hiển thị kết quả fetch về từ API
  const [open, setOpen] = useState(false)
  // State lưu trữ danh sách board fetch về được
  const [boards, setBoards] = useState(null)
  // Sẽ hiện loading khi bắt đầu gọi api fetch boards
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Khi đóng cái phần list kết quả lại thì đồng thời clear cho boards về null
    if (!open) {
      setBoards(null)
    }
  }, [open])

  // Xử lý việc nhận data nhập vào từ input sau đó gọi API để lấy kết quả về (cần cho vào useDebounceFn như bên dưới)
  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return

    // Dùng createSearchParams của react-router-dom để tạo một cái searchPath chuẩn với q[title] để gọi lên API
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    // Gọi API...
    setLoading(true)
    fetchBoardsAPI(searchPath)
      .then((res) => {
        setBoards(res.boards || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange)

  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard
