import { Helmet } from 'react-helmet-async'

const BASE_URL   = import.meta.env.VITE_APP_URL || ''
const SITE_NAME  = 'Pitonisa GPT'
const DEFAULT_IMG = `${BASE_URL}/og-image.png`

export default function SeoHead({ title, description, image, path }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Tu Oráculo con IA`
  const url = path ? `${BASE_URL}${path}` : undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      <meta property="og:title"       content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image"       content={image || DEFAULT_IMG} />
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:title"       content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"       content={image || DEFAULT_IMG} />
    </Helmet>
  )
}
