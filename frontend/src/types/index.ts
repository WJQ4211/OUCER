/**
 * Types - unified export
 */

// Common
export type {
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  ActivityStatus,
  NotificationType,
  SelectOption,
  ImageAsset,
  Address,
  AuthorBrief,
  Comment,
  EmptyStateProps,
  ToastType,
} from './common'

// Discussion (replaces recruitment)
export type {
  DiscussionPost,
  DiscussionFilter,
  DiscussionCategory,
  CreatePostForm,
  PostCardProps,
} from './discussion'
export { CATEGORY_MAP } from './discussion'

// Location / Activities
export type {
  Location,
  LocationCategory,
  Discussion,
  Activity,
  ActivityParticipant,
  ActivityForm,
  ActivityCardProps,
} from './location'

// User
export type {
  User,
  UserBrief,
  ProfileForm,
  WechatLoginParams,
  LoginResponse,
  EmailVerifyRequest,
  SendVerifyCodeRequest,
  ConfirmVerifyCodeRequest,
  ChsiVerifyRequest,
  VerifyResponse,
  SettingItem,
} from './user'
export { formatIdentity } from './user'

// Messages
export type {
  Notification,
  NotificationGroup,
  MessageTab,
  UnreadCount,
} from './message'
