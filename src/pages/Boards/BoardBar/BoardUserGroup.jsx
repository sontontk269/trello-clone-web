import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'

function BoardUserGroup({ boardUsers = [], limit = 4 }) {
  const [anchorRemainingEl, setAnchorRemainingEl] = useState(null)

  const openRemaining = Boolean(anchorRemainingEl)

  const idRemaining = openRemaining ? 'popover-remaining' : undefined

  const handleToggleRemaining = (event) => {
    setAnchorRemainingEl((prev) => (prev ? null : event.currentTarget))
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* Hiển thị giới hạn user */}
      {boardUsers.slice(0, limit).map((user, index) => (
        <Tooltip title={user?.displayName} key={index}>
          <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.displayName} src={user?.avatar} />
        </Tooltip>
      ))}

      {/* Nút +n → user còn lại */}
      {boardUsers.length > limit && (
        <Tooltip title="Show more users">
          <Box
            aria-describedby={idRemaining}
            onClick={handleToggleRemaining}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      )}

      {/* Popover: user còn lại */}
      <Popover
        id={idRemaining}
        open={openRemaining}
        anchorEl={anchorRemainingEl}
        onClose={() => setAnchorRemainingEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '235px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {boardUsers.slice(limit).map((user, index) => (
            <Tooltip title={user?.displayName} key={index}>
              <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.displayName} src={user?.avatar} />
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  )
}

export default BoardUserGroup
