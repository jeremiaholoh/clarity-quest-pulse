;; Quest Verification Contract
(define-constant err-unverified (err u300))
(define-constant err-already-verified (err u301))

(define-map verifications
  { quest-id: uint }
  { 
    verified: bool,
    verifier: principal,
    timestamp: uint
  }
)

(define-public (verify-quest (quest-id uint))
  (begin
    (asserts! (is-some (map-get? verifications {quest-id: quest-id})) err-already-verified)
    (map-insert verifications
      { quest-id: quest-id }
      {
        verified: true,
        verifier: tx-sender,
        timestamp: block-height
      }
    )
    (ok true)
  )
)

(define-read-only (is-verified (quest-id uint))
  (match (map-get? verifications {quest-id: quest-id})
    verification (ok (get verified verification))
    (ok false)
  )
)
