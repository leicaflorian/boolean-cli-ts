import { VideoRenamer } from '../src/modules/video-renamer/video-renamer'

describe('create video file names', () => {
  const videoRenamer = new VideoRenamer()
  
  test('should format only number and title', function () {
    const res = videoRenamer.createVideoFileName({
      video_number: 23,
      video_part_number: NaN,
      lesson_code: NaN,
      lesson_name: 'Lesson 1'
    }, 0, false)
    
    expect(res).toEqual('23-01DIC-lesson_1.mp4')
  })
  
  test('should format only number, lessonNum and title', function () {
    const res = videoRenamer.createVideoFileName({
      video_number: 1,
      video_part_number: NaN,
      lesson_code: 234,
      lesson_name: 'Lesson 1'
    }, 0, false)
    
    expect(res).toEqual('01-01DIC-234-lesson_1.mp4')
  })
  
  test('should format all', function () {
    for (let i = 0; i < 2; i++) {
      const res = videoRenamer.createVideoFileName({
        video_number: 1,
        video_part_number: 3,
        lesson_code: 234,
        lesson_name: 'Lesson 1'
      }, i, true)
      
      expect(res).toEqual(`01_${3 + i}-01DIC-234-lesson_1.mp4`)
    }
  })
  
  test('should handle autoIncludePart number', function () {
    for (let i = 0; i < 5; i++) {
      const res = videoRenamer.createVideoFileName({
        video_number: 1,
        video_part_number: NaN,
        lesson_code: 234,
        lesson_name: 'Lesson 1'
      }, i, true)
      
      expect(res).toEqual(`01_${i + 1}-01DIC-234-lesson_1.mp4`)
    }
  })
  
})

