'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const MAX_FILE_SIZE = 70 * 1024 * 1024; // Max file size 70MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size should be less than 70MB.');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading your video...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('originalSize', file.size.toString());

    try {
      const response = await axios.post('/api/video-upload', formData);
      if (response.status === 200) {
        toast.success('Video uploaded successfully!');
        router.push('/');
      } else {
        throw new Error('Failed to upload video');
      }
    } catch (error) {
      toast.error('Failed to upload video.');
    } finally {
      toast.dismiss(loadingToast);
      setIsUploading(false);
    }
  };

  return (
     
      <div className="container mx-auto p-8 md:pb-24  bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Upload Your Video</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-lg font-semibold text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700">Video File</label>
              <div className="mt-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="file-label w-full p-4 border-2 border-gray-300 rounded-lg cursor-pointer text-center text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  {file ? `Selected: ${file.name}` : 'Choose a video file'}
                </label>
              </div>
            </div>
            <button
              type="submit"
              className={`btn w-full p-3 text-white text-xl font-semibold rounded-lg transition-all duration-300 ${
                isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>
      </div>
     
  );
};

export default VideoUpload;
