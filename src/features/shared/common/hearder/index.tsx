import { Link } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { uidAtom } from '@atoms'
import { signOut } from 'firebase/auth'
import { auth } from '@shared/infrastructures/firebase'
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Person,
  Create,
  ImageSearch,
  People,
  Logout,
  Psychology,
} from '@mui/icons-material'
export const HeaderComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const uid = useAtomValue(uidAtom)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setDrawerOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open)
  }

  const menuItems = [
    { label: 'ホーム', path: '/', icon: <Home /> },
    { label: 'ユーザー一覧', path: '/users', icon: <People /> },
    {
      label: 'プロフィール',
      path: `/users/${uid}`,
      icon: <Person />,
      requiresAuth: true,
    },
    { label: '投稿を作成', path: '/createPost', icon: <Create /> },
    { label: 'AI画像生成', path: '/generateImage', icon: <ImageSearch /> },
  ]

  return (
    <>
      <AppBar
        position='fixed'
        sx={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          color: 'text.primary',
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              edge='start'
              onClick={() => toggleDrawer(true)}
              sx={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background:
                    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                }}
              >
                <Psychology sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 700,
                  background:
                    'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.025em',
                }}
              >
                GreatTalk
              </Typography>
            </Box>
          </Box>

          {uid && (
            <Chip
              label='ログイン中'
              size='small'
              sx={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant='h5'
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🚀 メニュー
            </Typography>
            <IconButton
              onClick={() => toggleDrawer(false)}
              sx={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ gap: 1 }}>
            {menuItems.map((item, index) => {
              if (item.requiresAuth && !uid) return null

              return (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => toggleDrawer(false)}
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.6)',
                      border: '1px solid rgba(226, 232, 240, 0.5)',
                      transition:
                        'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                        transform: 'translateX(8px) scale(1.02)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#22c55e',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          fontSize: '1rem',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}

            {uid && (
              <>
                <Divider sx={{ my: 2, opacity: 0.3 }} />
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 3,
                      background:
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                        transform: 'translateX(8px) scale(1.02)',
                        boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText
                      primary='ログアウト'
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          fontSize: '1rem',
                          color: '#ef4444',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Spacer to prevent content from hiding under fixed AppBar */}
      <Toolbar />
    </>
  )
}
