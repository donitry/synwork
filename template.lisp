;;;;;;; template
;;;
(in-package #:synwork)

(<:augment-with-doctype "html" "" :auto-emit-p t)

(defun html-frame (context)
  (<:html
	(<:head (<:title (getf context :title))
			;;style
			(<:link :rel "stylesheet" :type "text/css" :href "/static/css/style.css"))
	(<:body
	  (<:div 
		(<:iframe :src "/bar"))
	  (<:div
		(<:h1 (getf context :title))
		(<:a :href (genurl 'home) "首页") " | "
		(if (logged-on-p)
		  (list (format nil "Welcome ~A" (logged-on-p))
		  		" | "
			    (<:a :href (genurl '-authdemo-.logout)
					 (format nil "注销 ~A"
							 (logged-on-p)))
				" | "
				(<:a :href (genurl '-project-.project/create) "c_pro"))
		  (list (<:a :href (genurl '-authdemo-.login) "登录")
				" Or "
				(<:a :href (genurl '-authdemo-.register) "注册")))
		" -- "  (<:a :href (genurl '-authdemo-.test) "Test")
		" -- "  (<:a :href (genurl '-project-.project-list :page-id 0) "show projects")
		(<:hr))
	  (getf context :body))))


