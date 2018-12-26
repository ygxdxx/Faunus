import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle, findIndex} from 'common/js/until'
import {saveSearch} from 'common/js/cache'

export const clickOneSongPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    index = findIndex(state.playList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const clickRandomSongPlay = function ({commit}, {list}) {
  commit(types.SET_PLAYMODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //记录当前播放的歌曲
  let currentSong = playlist[currentIndex]
  //在当前播放列表中查找是否有这首歌曲
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  //插入这首歌到当前播放歌曲的后面
  playlist.splice(currentIndex, 0, song)
  console.log(playlist)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      //原本这首歌在插入位置的前面，删除掉之后playlist前面少了一个，currentIndex就需要往前移动一位才能正确播放
      currentIndex--
    } else {
      //原本这首歌在插入位置的后面，插入之后这首歌往后挪动了一位，所以要删除的位置就是fpIndex+1
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let insertSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(insertSIndex, 0, song)
  if (fsIndex > -1) {
    if (insertSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}
