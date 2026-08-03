function Icon({ children, className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  )
}

export function IconClipboard(props) {
  return (
    <Icon {...props}>
      <rect x="6" y="4" width="12" height="17" rx="1.5" />
      <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M9 11h6M9 15h4" />
    </Icon>
  )
}

export function IconChefHat(props) {
  return (
    <Icon {...props}>
      <path d="M6 13a4 4 0 01.7-7.9 4.5 4.5 0 018.6 0A4 4 0 0120 13" />
      <path d="M6 13h12v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6z" />
    </Icon>
  )
}

export function IconTruck(props) {
  return (
    <Icon {...props}>
      <rect x="1" y="7" width="13" height="10" rx="1" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </Icon>
  )
}

export function IconCheckCircle(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </Icon>
  )
}

export function IconXCircle(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </Icon>
  )
}

export function IconUser(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" />
    </Icon>
  )
}

export function IconMapPin(props) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.5 7-11.5a7 7 0 10-14 0C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </Icon>
  )
}

export function IconPackage(props) {
  return (
    <Icon {...props}>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </Icon>
  )
}

export function IconLogout(props) {
  return (
    <Icon {...props}>
      <path d="M9 21H5a1 1 0 01-1-1V4a1 1 0 011-1h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </Icon>
  )
}

export function IconPlus(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}
