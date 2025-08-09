import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Alert,
  Chip,
  Divider,
} from '@mui/material'
import { VolumeOff, Psychology, CheckCircle, Info } from '@mui/icons-material'
import { PostsComponent } from '../posts'
import { usePostMute } from '../../hooks/use-post-mute'

type DemoMode = 'normal' | 'with-mute'

export const MuteDemoComponent = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>('normal')
  const { mutePostTokens, mutePostIds } = usePostMute()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Demo Header */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <VolumeOff color='primary' />
            <Typography variant='h5' sx={{ fontWeight: 600 }}>
              投稿ミュート機能デモ
            </Typography>
          </Box>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            Flutter
            nativeアプリを参考にした投稿ミュート機能のデモンストレーション
          </Typography>

          {/* デモモード切り替え */}
          <ButtonGroup variant='outlined' size='small' sx={{ mb: 2 }}>
            <Button
              onClick={() => setDemoMode('normal')}
              variant={demoMode === 'normal' ? 'contained' : 'outlined'}
              startIcon={<Psychology />}
            >
              通常表示
            </Button>
            <Button
              onClick={() => setDemoMode('with-mute')}
              variant={demoMode === 'with-mute' ? 'contained' : 'outlined'}
              startIcon={<VolumeOff />}
            >
              ミュート機能あり
            </Button>
          </ButtonGroup>

          <Divider sx={{ my: 2 }} />

          {/* 機能説明 */}
          <Alert severity='info' sx={{ mb: 2 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>ミュート機能の使い方：</strong>
            </Typography>
            <Box component='ul' sx={{ pl: 2, m: 0 }}>
              <li>投稿カードの右上のメニュー（⋮）をクリック</li>
              <li>「投稿をミュート」を選択</li>
              <li>ミュートされた投稿は専用カードで表示</li>
              <li>「ミュートを解除」でミュートを取り消し</li>
            </Box>
          </Alert>

          {/* ミュート状態表示 */}
          {mutePostTokens.length > 0 && (
            <Alert severity='success' sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                <CheckCircle fontSize='small' />
                <Typography variant='body2' sx={{ fontWeight: 500 }}>
                  現在 {mutePostTokens.length} 件の投稿をミュート中
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {mutePostIds.slice(0, 5).map(postId => (
                  <Chip
                    key={postId}
                    label={`投稿 ${postId.slice(0, 8)}...`}
                    size='small'
                    color='warning'
                    variant='outlined'
                  />
                ))}
                {mutePostIds.length > 5 && (
                  <Chip
                    label={`他 ${mutePostIds.length - 5} 件`}
                    size='small'
                    color='default'
                    variant='outlined'
                  />
                )}
              </Box>
            </Alert>
          )}

          {/* 技術仕様 */}
          <Alert severity='warning'>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>実装された機能：</strong>
            </Typography>
            <Box component='ul' sx={{ pl: 2, m: 0 }}>
              <li>投稿ミュート・ミュート解除</li>
              <li>ミュート状態の永続化（Firestore）</li>
              <li>楽観的アップデート</li>
              <li>ミュートされた投稿の専用表示</li>
              <li>投稿メニュー統合</li>
            </Box>
          </Alert>
        </CardContent>
      </Card>

      {/* Current View */}
      {demoMode === 'normal' && (
        <Alert severity='info' sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          <Info sx={{ mr: 1 }} />
          通常表示モード - 投稿にミュート機能が統合されています
        </Alert>
      )}

      {demoMode === 'with-mute' && (
        <Alert severity='warning' sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          <VolumeOff sx={{ mr: 1 }} />
          ミュート機能デモモード - ミュートされた投稿は特別な表示になります
        </Alert>
      )}

      <PostsComponent />
    </Box>
  )
}

export default MuteDemoComponent
