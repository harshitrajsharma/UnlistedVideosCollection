'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlayCircle, Plus, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

interface Video {
  _id: string
  youtubeId: string
  title: string
}

export function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          setIsAuthenticated(true)
          fetchVideos()
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const addVideo = async () => {
    setIsLoading(true)
    try {
      const youtubeId = new URL(newVideoUrl).searchParams.get('v')
      if (!youtubeId) throw new Error('Invalid YouTube URL')

      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeId, title: newVideoTitle }),
      })

      if (response.ok) {
        const newVideo = await response.json()
        setVideos(prevVideos => [...prevVideos, newVideo])
        setNewVideoUrl('')
        setNewVideoTitle('')
        setIsAddDialogOpen(false)
      } else {
        throw new Error('Failed to add video')
      }
    } catch (error) {
      console.error('Error adding video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      <nav className="bg-gray-100 dark:bg-gray-900 p-4 flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlisted YT
        </motion.h1>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Video
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {videos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 h-full w-full flex justify-center items-center"
          >
            <div className=' w-full h-full'>
              <h2 className="text-2xl font-semibold mb-4">No videos to show</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Add your first video to get started!</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Your First Video
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="bg-white dark:bg-gray-800 overflow-hidden group hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedVideo(video.youtubeId)}
                  >
                    <CardContent className="p-0 relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {videos.find(v => v.youtubeId === selectedVideo)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video mt-2">
            {mounted && selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Add New Video</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter the URL and title of the unlisted YouTube video you want to add.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <Input
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
            placeholder="Video Title"
            className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          />
          <DialogFooter>
            <Button onClick={addVideo} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white">
              {isLoading ? 'Adding...' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}