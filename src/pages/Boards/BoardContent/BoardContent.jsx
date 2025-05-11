import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensors'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board, moveColumn, moveCardInTheSameColumn, moveCardToDifferentColumn }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   // Require the mouse to move by 10 pixels before activating
  //   activationConstraint: { distance: 10 }
  // })
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  // const sensors = useSensors(pointerSensor)
  // /Priority is given to using a combination of two types of sensors, mouse and touch, to have the best, error-free mobile experience.
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOderedColumns] = useState([])
  // only 1 element (column or card) dragged at a same time
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  //điểm va chạm cuối cùng trước đó (xử lí thuật toán phát hiện va chạm )
  const lastOverId = useRef(null)
  useEffect(() => {
    // // const orderedColumns = mapOrder(
    // //   board?.columns,
    // //   board?.columnOrderIds,
    // //   '_id'
    // // )
    // setOderedColumns(orderedColumns)

    setOderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column.cards.map((card) => card._id)?.includes(cardId))
  }

  // drag start
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      // nếu mà kéo card mới set giá trị oldColumn
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // function chung xu li
  const moveCardBetweenDifferenctColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOderedColumns((prevColumns) => {
      //tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp dc thả)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)
      // logic tính toán "cardIndex mới " (trên hoặc dưới của overCard) lấy chuẩn ra từ code thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      //Clone mảng orderedColumn cũ ra một cái mới để xử lí data rồi return - cập nhật lại orderedColumn mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)
      //column cũ
      if (nextActiveColumn) {
        // xóa card ở cái column active (có thể hiểu là column cũ, cái lúc kéo card ra khỏi nó sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        //them Placeholder card neu la column rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cập nhật lại cardIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }
      //column mới
      if (nextOverColumn) {
        //kiểm tra xem cái card đang kéo có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId)
        //dragEnd phải cập nhật lại data columnId
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        //xoa placeholderCard neu no ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard)
        // cập nhật lại cardIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }

      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }
      return nextColumns
    })
  }

  const handleDragOver = (event) => {
    // do nothing if we dnd column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // if dnd card => handle action dnd card between other columns
    const { active, over } = event
    // Check if "over" or "active" does not exist (if you drag miscellaneous items out, return immediately to avoid errors)
    if (!active || !over) return
    // activeDraggingCard: card is dragging
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    //overCard : card is being  interacted with activeDraggingCard
    const { id: overCardId } = over
    // find 2 columns with cardID
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    // xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau , còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // vì đây là đoạn xử lí lúc kéo (handleDragOver), còn xử lí lúc kéo xong xuôi thì nó lại là vấn đè khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferenctColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  // drop
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Check if "over" or "active" does not exist (if you drag miscellaneous items out, return immediately to avoid errors)
    if (!active || !over) return
    //handle drag and drop card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: card is dragging
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      //overCard : card is being  interacted with activeDraggingCard
      const { id: overCardId } = over
      // find 2 columns with cardID
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return
      // hành động kéo thả card giữa 2 column khác nhau
      // phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ handleStart) chứ k phải activeData
      //trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //

        moveCardBetweenDifferenctColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        //dnd trong cungf 1  column, logic giong voi dnd column
        // find old location from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragItemId)
        // find new location from over
        const newCardIndex = overColumn?.cards.findIndex((c) => c._id === overCardId)
        // use arrayMove to sort card again (after dnd)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex) // cards after dnd
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)
        setOderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns)
          //tim column dang drop
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)
          //cap nhat lai gtri moi
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          return nextColumns
        })

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }
    //handle drag and drop column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // if the new location is different from the original location
      if (active.id !== over.id) {
        // find old location from active
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
        // find new location from over
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)
        // use arrayMove to sort column again (after dnd)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex) // columns after dnd

        setOderedColumns(dndOrderedColumns)
        moveColumn(dndOrderedColumns)
        //update setOderedColumns
      }
    }
    // những dữ liệu sau khj kéo thả này luôn phải đưa về gtri null mặc địng ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  //custom lai thuajt toan phat hien va cham
  const collisionDetectionStragegy = useCallback(
    (args) => {
      //Th kéo Column thì dùng closestConner
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }
      // tim diem giao nhau, va cham voi con tro
      const pointerIntersections = pointerWithin(args)
      //thaut toan phast hien va cham
      if (!pointerIntersections?.length) return
      // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection

      // // tim overId dau tien trong pointerIntersections ow tren
      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        const checkColumn = orderedColumns.find((column) => column._id === overId)

        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      // nếu overId = null thì return lastOverId
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType]
  )
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      //  thuật toán phát hiện va chạm(nếu k có nó thì card với cover lớn sẽ không kéo qua Column dc vì lúc này nó đang bị con flict giữa card và column)
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStragegy}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          p: '10px 0',
          height: (theme) => theme.trelloCustom.boardContentHeight
        }}
      >
        <ListColumns columns={orderedColumns} />

        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemData && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemData && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
