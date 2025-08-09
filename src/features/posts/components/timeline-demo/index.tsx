import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
} from '@mui/material'
import { Timeline, TrendingUp, Schedule } from '@mui/icons-material'
import { PostsComponent } from '../posts'
import { TimelineComponent } from '../timeline'
import { EnhancedTimelineComponent } from '../enhanced-timeline'

type ViewType = 'posts' | 'timeline' | 'enhanced'

export const TimelineDemoComponent = () => {
  const [currentView, setCurrentView] = useState<ViewType>('posts')

  const renderCurrentView = () => {
    switch (currentView) {
      case 'posts':
        return <PostsComponent />
      case 'timeline':
        return <TimelineComponent />
      case 'enhanced':
        return <EnhancedTimelineComponent />
      default:
        return <PostsComponent />
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Demo Header */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Timeline color='primary' />
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              Timeline Demo
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Flutter
            nativeアプリを参考にしたタイムライン投稿機能のデモンストレーション
          </Typography>

          <ButtonGroup variant='outlined' size='small'>
            <Button
              onClick={() => setCurrentView('posts')}
              variant={currentView === 'posts' ? 'contained' : 'outlined'}
              startIcon={<TrendingUp />}
            >
              基本投稿一覧
            </Button>
            <Button
              onClick={() => setCurrentView('timeline')}
              variant={currentView === 'timeline' ? 'contained' : 'outlined'}
              startIcon={<Schedule />}
            >
              タイムライン
            </Button>
            <Button
              onClick={() => setCurrentView('enhanced')}
              variant={currentView === 'enhanced' ? 'contained' : 'outlined'}
              startIcon={<Timeline />}
            >
              拡張タイムライン
            </Button>
          </ButtonGroup>
        </CardContent>
      </Card>

      {/* Current View */}
      {renderCurrentView()}
    </Box>
  )
}

export default TimelineDemoComponent
