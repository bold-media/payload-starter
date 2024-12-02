import {
  DefaultTranslationKeys,
  NestedKeysStripped,
  I18nServer as PayloadI18nServer,
  I18nClient as PayloadI18nClient,
  TFunction as PayloadTFunction,
} from '@payloadcms/translations'
import { en } from './en'
import { ru } from './ru'

export type MessageTranslationKeys = NestedKeysStripped<typeof messages.en>

export type I18nServer = PayloadI18nServer<typeof en, MessageTranslationKeys>
export type I18nClient = PayloadI18nClient<typeof en, MessageTranslationKeys>
export type TFunction = PayloadTFunction<DefaultTranslationKeys | MessageTranslationKeys>

export const messages = { en, ru }
