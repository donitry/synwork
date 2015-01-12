;;;;;;; util.lisp
;;;
(in-package #:synwork)

(defun start-synwork (&key
					   (port 8081)
					   ;(datastore 'synwork.redis-datastore:redis-datastore)
					   ;(datastore-init nil)
					   )
  ;(setf *datastore* (apply #'make-instance datastore datastore-init))
  ;(init)
  (synwork-auth:init-datastore-auth :datastore 'synwork-auth.pg-datastore:pg-datastore
									:datastore-init '(:connection-spec ("synwork" "sexdon" "zxc123.com" "localhost")))

  (synwork-project:init-datastore-project :datastore 'synwork-project.pg-datastore:pg-datastore
										  :datastore-init '(:connection-spec ("synwork" "sexdon" "zxc123.com" "localhost")))
  
  (setf hunchentoot:*show-lisp-errors-p* t)
  (setf hunchentoot:*show-lisp-backtraces-p* t)
  (start '#:synwork :port port :render-method 'html-frame))
