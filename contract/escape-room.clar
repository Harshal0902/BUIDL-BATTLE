(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)

(define-data-var owner principal tx-sender)
(define-map riddles uint {question: (string-ascii 100), answer: (string-ascii 50), location: (string-ascii 50)})
(define-map user-progress principal uint)
(define-non-fungible-token escape-room-nft uint)
(define-data-var last-id uint u0)
(define-data-var total-riddles uint u0)

(define-public (add-riddle (id uint) (question (string-ascii 100)) (answer (string-ascii 50)) (location (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u401))
    (map-set riddles id {question: question, answer: answer, location: location})
    (var-set total-riddles (+ (var-get total-riddles) u1))
    (ok true)
  )
)

(define-public (submit-answer (id uint) (answer (string-ascii 50)) (location (string-ascii 50)))
  (let ((riddle (unwrap! (map-get? riddles id) (err u404)))
        (progress (default-to u0 (map-get? user-progress tx-sender))))
    (asserts! (is-eq progress (- id u1)) (err u403))
    (asserts! (is-eq location (get location riddle)) (err u402))
    (if (is-eq answer (get answer riddle))
      (begin
        (map-set user-progress tx-sender id)
        (if (is-eq id (var-get total-riddles))
          (mint-completion-nft tx-sender)
          (ok true)
        )
      )
      (err u405)
    )
  )
)

(define-read-only (get-current-riddle (user principal))
  (let ((progress (default-to u0 (map-get? user-progress user))))
    (ok (map-get? riddles (+ progress u1)))
  )
)

(define-private (mint-completion-nft (user principal))
  (let ((next-id (+ u1 (var-get last-id))))
    (var-set last-id next-id)
    (nft-mint? escape-room-nft next-id user)
  )
)

(define-read-only (get-progress (user principal))
  (ok (default-to u0 (map-get? user-progress user)))
)

(define-read-only (get-total-riddles)
  (ok (var-get total-riddles))
)