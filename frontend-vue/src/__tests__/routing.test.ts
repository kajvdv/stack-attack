import { vi, describe } from 'vitest'
import { test, expect } from '@/__tests__/setup'
import { mount } from '@vue/test-utils'

describe('Test behaviour based on cookie', () => {
  test('/lobby redirects to /lobby?code=AAAA when having valid cookie')

  test('/board redirect to / when no valid cookie')

  test('/lobby redirect to / when no valid cookie')
})

describe('Test routing based on query parameter', () => {
  test('/join redirects back to home when no query parameter')

  test('/lobby?code=AAAA redirects to /join?code=AAAA when no cookie')
})
