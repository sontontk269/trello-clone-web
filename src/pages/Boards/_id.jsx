import Container from '@mui/material/Container'

import AppBar from '~/components/AppBAr/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

import { useDispatch, useSelector } from 'react-redux'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentAPI } from '~/apis'

import { cloneDeep } from 'lodash'

import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    //call api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  //call api va xu li khi keo tha column xong
  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id) //dndOrderedColumnsIds used to update columnsIds when execute api

    //cập nhật lại state board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    dispatch(updateCurrentActiveBoard(newBoard))

    //call api update board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    //cập nhật lại state column
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    //call api update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id) //dndOrderedColumnsIds used to update columnsIds when execute api

    //cập nhật lại state board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds

    dispatch(updateCurrentActiveBoard(newBoard))
    let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    //call api xu li phia BE
    moveCardToDifferentAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }

  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        <ActiveCard />
        <AppBar />

        <BoardBar board={board} />

        <BoardContent
          board={board}
          moveColumn={moveColumn}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
        />
      </Container>
    </>
  )
}

export default Board
