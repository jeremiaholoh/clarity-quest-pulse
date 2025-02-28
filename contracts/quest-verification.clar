;; Quest Verification Contract
(use-trait quest-manager .quest-manager.quest-manager)

(define-constant err-unverified (err u300))
(define-constant err-already-verified (err u301))
(define-constant err-quest-not-found (err u302))

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
    ;; Check if quest exists
    (asserts! (is-some (contract-call? .quest-manager get-quest quest-id)) err-quest-not-found)
    (asserts! (is-none (map-get? verifications {quest-id: quest-id})) err-already-verified)
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
