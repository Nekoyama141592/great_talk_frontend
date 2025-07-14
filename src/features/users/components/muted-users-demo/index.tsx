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
  Container
} from '@mui/material'
import { 
  PersonOff, 
  Psychology, 
  CheckCircle,
  Info,
  People
} from '@mui/icons-material'
import { useUserMute } from '../../hooks/use-user-mute'
import { MutedUserCard } from '../muted-user-card'

type DemoMode = 'normal' | 'with-mute' | 'muted-only'

// サンプルユーザーデータ
const sampleMutedUsers = [
  {
    uid: 'sample-user-1',
    displayName: 'サンプルユーザー1',
    email: 'sample1@example.com',
    photoURL: undefined
  },
  {
    uid: 'sample-user-2', 
    displayName: 'サンプルユーザー2',
    email: 'sample2@example.com',
    photoURL: undefined
  },
  {
    uid: 'sample-user-3',
    displayName: undefined,
    email: 'sample3@example.com',
    photoURL: undefined
  }
]

export const MutedUsersDemoComponent = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>('normal')
  const { muteUserTokens, muteUserIds } = useUserMute()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Demo Header */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonOff color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ユーザーミュート機能デモ
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Flutter nativeアプリを参考にしたユーザーミュート機能のデモンストレーション
          </Typography>

          {/* デモモード切り替え */}
          <ButtonGroup variant="outlined" size="small" sx={{ mb: 2 }}>
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
              startIcon={<People />}
            >
              ミュート機能あり
            </Button>
            <Button
              onClick={() => setDemoMode('muted-only')}
              variant={demoMode === 'muted-only' ? 'contained' : 'outlined'}
              startIcon={<PersonOff />}
            >
              ミュート済みのみ
            </Button>
          </ButtonGroup>

          <Divider sx={{ my: 2 }} />

          {/* 機能説明 */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>ユーザーミュート機能の使い方：</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>ユーザープロフィールページのメニュー（⋮）をクリック</li>
              <li>「ユーザーをミュート」を選択</li>
              <li>ミュートされたユーザーの投稿は非表示になります</li>
              <li>「ミュートを解除」でミュートを取り消し</li>
            </Box>
          </Alert>

          {/* ミュート状態表示 */}
          {muteUserTokens.length > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  現在 {muteUserTokens.length} 人のユーザーをミュート中
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {muteUserIds.slice(0, 5).map((userId) => (
                  <Chip
                    key={userId}
                    label={`ユーザー ${userId.slice(0, 8)}...`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                ))}
                {muteUserIds.length > 5 && (
                  <Chip
                    label={`他 ${muteUserIds.length - 5} 人`}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                )}
              </Box>
            </Alert>
          )}

          {/* 技術仕様 */}
          <Alert severity="warning">
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>実装された機能：</strong>
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>ユーザーミュート・ミュート解除</li>
              <li>ミュート状態の永続化（Firestore）</li>
              <li>楽観的アップデート</li>
              <li>ミュートされたユーザーの専用表示</li>
              <li>ユーザープロフィールでのミュート状態表示</li>
              <li>投稿フィルタリング（ミュートユーザーの投稿非表示）</li>
            </Box>
          </Alert>
        </CardContent>
      </Card>

      {/* Current View */}
      {demoMode === 'normal' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Info sx={{ mr: 1 }} />
          通常表示モード - ユーザーにミュート機能が統合されています
        </Alert>
      )}

      {demoMode === 'with-mute' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <People sx={{ mr: 1 }} />
          ミュート機能デモモード - ユーザープロフィールでミュート機能を確認できます
        </Alert>
      )}

      {demoMode === 'muted-only' && (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <PersonOff sx={{ mr: 1 }} />
            ミュート済みユーザー表示モード
          </Alert>
          
          {/* ミュートされたユーザーのカード表示 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {muteUserTokens.length === 0 ? (
              <Alert severity="info">
                <Typography>
                  現在ミュートしているユーザーはいません。
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ユーザープロフィールページでユーザーをミュートできます。
                </Typography>
              </Alert>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  ミュート中のユーザー ({muteUserTokens.length}人)
                </Typography>
                {sampleMutedUsers.map((user) => (
                  <MutedUserCard
                    key={user.uid}
                    user={user}
                  />
                ))}
              </>
            )}
          </Box>
        </>
      )}
    </Container>
  )
}

export default MutedUsersDemoComponent