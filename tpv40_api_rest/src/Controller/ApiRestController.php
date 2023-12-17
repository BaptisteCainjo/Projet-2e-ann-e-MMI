<?php

namespace App\Controller;

use App\Entity\Catalogue\Article;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Psr\Log\LoggerInterface;

use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Catalogue\Livre;
use App\Entity\Catalogue\Musique;
use App\Entity\Catalogue\Piste;

use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Doctrine\DBAL\Exception\ConstraintViolationException;

class ApiRestController extends AbstractController
{
	private $entityManager;
	private $logger;

	public function __construct(EntityManagerInterface $entityManager, LoggerInterface $logger)
	{
		$this->entityManager = $entityManager;
		$this->logger = $logger;
	}

	/**
	 * @Route("/wp-json/wc/v3/products", name="list-all-products", methods={"GET"})
	 */
	public function listAllProducts()
	{
		$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a");
		$articles = $query->getArrayResult();
		$response = new Response();
		$response->setStatusCode(Response::HTTP_OK); // 200 https://github.com/symfony/http-foundation/blob/5.4/Response.php
		$response->setContent(json_encode($articles));
		$response->headers->set('Content-Type', 'application/json');
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
	}

	/**
	 * @Route("/wp-json/wc/v3/products", name="allow-create-a-product", methods={"OPTIONS"})
	 */
	public function allowCreateAProduct(Request $request)
	{
		$response = new Response();
		$response->setStatusCode(Response::HTTP_OK); // 200 https://github.com/symfony/http-foundation/blob/5.4/Response.php
		$response->headers->set('Access-Control-Allow-Origin', '*');
		$response->headers->set('Access-Control-Allow-Methods', $request->headers->get('Access-Control-Request-Method'));
		$response->headers->set('Access-Control-Allow-Headers', $request->headers->get('Access-Control-Request-Headers'));
		return $response;
	}

	/**
	 * @Route("/wp-json/wc/v3/products/{id}", name="allow-update-a-product", methods={"OPTIONS"})
	 */
	public function allowUpdateAProduct(Request $request)
	{
		$response = new Response();
		$response->setStatusCode(Response::HTTP_OK);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		$response->headers->set('Access-Control-Allow-Methods', $request->headers->get('Access-Control-Request-Method'));
		$response->headers->set('Access-Control-Allow-Headers', $request->headers->get('Access-Control-Request-Headers'));
		return $response;
	}


	/**
	 * @Route("/wp-json/wc/v3/products/{id}", name="allow-delete-a-product", methods={"OPTIONS"})
	 */
	public function allowDeleteAProduct(Request $request)
	{
		$response = new Response();
		$response->setStatusCode(Response::HTTP_OK);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		$response->headers->set('Access-Control-Allow-Methods', $request->headers->get('Access-Control-Request-Method'));
		$response->headers->set('Access-Control-Allow-Headers', $request->headers->get('Access-Control-Request-Headers'));
		return $response;
	}



	/**
	 * @Route("/wp-json/wc/v3/products", name="create-a-product", methods={"POST"})
	 */
	public function createAProduct(Request $request)
	{
		$article = json_decode($request->getContent(), true);
		if (isset($article["article_type"])) {
			if ($article["article_type"] == "musique") {
				$entity = new Musique();
				$formBuilder = $this->createFormBuilder($entity, array('csrf_protection' => false));
				$formBuilder->add("id", TextType::class);
				$formBuilder->add("titre", TextType::class);
				$formBuilder->add("createur", TextType::class);
				$formBuilder->add("prix", NumberType::class);
				$formBuilder->add("disponibilite", IntegerType::class);
				$formBuilder->add("image", TextType::class);
				$formBuilder->add("dateDeParution", TextType::class);
				$formBuilder->add("valider", SubmitType::class);
				// Generate form
				$form = $formBuilder->getForm();
				$form->submit($article);
				if ($form->isSubmitted()) {
					try {
						$entity = $form->getData();
						$id = uniqid();
						$entity->setId($id);
						$this->entityManager->persist($entity);
						$this->entityManager->flush();
						$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
						$query->setParameter("id", $id);
						$article = $query->getArrayResult();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_CREATED); // 201 https://github.com/symfony/http-foundation/blob/5.4/Response.php
						$response->setContent(json_encode($article));
						$response->headers->set('Location', '/wp-json/wc/v3/products/' . $id);
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						$response->headers->set('Access-Control-Expose-Headers', 'Location');

						return $response;
					} catch (ConstraintViolationException $e) {
						$errors = $form->getErrors();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY); // 422 https://github.com/symfony/http-foundation/blob/5.4/Response.php
						$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => 'Constraint violation')));
						$response->headers->set('Content-Type', 'application/json');
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						return $response;
					}
				} else {
					$errors = $form->getErrors();
					$response = new Response();
					$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400 https://github.com/symfony/http-foundation/blob/5.4/Response.php
					$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => $errors->__toString())));
					//$response->setContent(json_encode(array('message' => 'Invalid input'))) ;
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
			}
			if ($article["article_type"] == "livre") {
				$entity = new Livre();
				$formBuilder = $this->createFormBuilder($entity, array('csrf_protection' => false));
				$formBuilder->add("id", TextType::class);
				$formBuilder->add("titre", TextType::class);
				$formBuilder->add("createur", TextType::class);
				$formBuilder->add("prix", NumberType::class);
				$formBuilder->add("disponibilite", IntegerType::class);
				$formBuilder->add("image", TextType::class);
				$formBuilder->add("ISBN", TextType::class, ['required' => true]);
				$formBuilder->add("nbPages", IntegerType::class);
				$formBuilder->add("dateDeParution", TextType::class);
				$formBuilder->add("valider", SubmitType::class);
				// Generate form
				$form = $formBuilder->getForm();
				$form->submit($article);
				if ($form->isSubmitted()) {
					try {
						$entity = $form->getData();
						$id = uniqid();
						$entity->setId($id);
						$this->entityManager->persist($entity);
						$this->entityManager->flush();
						$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
						$query->setParameter("id", $id);
						$article = $query->getArrayResult();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_CREATED); // 201 https://github.com/symfony/http-foundation/blob/5.4/Response.php
						$response->setContent(json_encode($article));
						$response->headers->set('Location', '/wp-json/wc/v3/products/' . $id);
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						$response->headers->set('Access-Control-Expose-Headers', 'Location');
						return $response;
					} catch (ConstraintViolationException $e) {
						$errors = $form->getErrors();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY); // 422 https://github.com/symfony/http-foundation/blob/5.4/Response.php
						$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => 'Constraint violation')));
						$response->headers->set('Content-Type', 'application/json');
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						return $response;
					}
				} else {
					$errors = $form->getErrors();
					$response = new Response();
					$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400 https://github.com/symfony/http-foundation/blob/5.4/Response.php
					$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => $errors->__toString())));
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
			}
		} else {
			$response = new Response();
			$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400 https://github.com/symfony/http-foundation/blob/5.4/Response.php
			$response->setContent(json_encode(array('message' => 'Invalid input: No article_type found')));
			$response->headers->set('Content-Type', 'application/json');
			$response->headers->set('Access-Control-Allow-Origin', '*');
			$response->headers->set('Access-Control-Allow-Headers', '*');
			return $response;
		}
	}

	/**
	 * @Route("/wp-json/wc/v3/products/{id}", name="retrieve-a-product", methods={"GET"})
	 */
	public function retrieveAProduct(string $id)
	{
		// http://127.0.0.1:8000/wp-json/wc/v3/products/B07KBT4ZRG
		$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
		$query->setParameter("id", $id);
		$article = $query->getArrayResult();
		if (count($article) !== 0) {
			$response = new Response();
			$response->setStatusCode(Response::HTTP_OK); // 200 https://github.com/symfony/http-foundation/blob/5.4/Response.php
			$response->setContent(json_encode($article));
			$response->headers->set('Content-Type', 'application/json');
			$response->headers->set('Access-Control-Allow-Origin', '*');
			return $response;
		} else {
			$response = new Response();
			$response->setStatusCode(Response::HTTP_NOT_FOUND); // 404 https://github.com/symfony/http-foundation/blob/5.4/Response.php
			$response->setContent(json_encode(array('message' => 'Resource not found: No article found for id ' . $id)));
			$response->headers->set('Content-Type', 'application/json');
			$response->headers->set('Access-Control-Allow-Origin', '*');
			return $response;
		}
	}

	/**
	 * @Route("/wp-json/wc/v3/products/{id}", name="update-product", methods={"PUT"})
	 */
	public function updateProduct(Request $request, $id)
	{
		$article = json_decode($request->getContent(), true);
		if (isset($article["article_type"])) {
			if ($article["article_type"] == "musique") {
				$entity = $this->entityManager->getRepository(Musique::class)->find($id);
				if (!$entity) {
					$response = new Response();
					$response->setStatusCode(Response::HTTP_NOT_FOUND); // 404
					$response->setContent(json_encode(array('message' => 'Product not found')));
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
				$formBuilder = $this->createFormBuilder($entity, array('csrf_protection' => false));
				$formBuilder->add("titre", TextType::class);
				$formBuilder->add("createur", TextType::class);
				$formBuilder->add("prix", NumberType::class);
				$formBuilder->add("disponibilite", IntegerType::class);
				$formBuilder->add("image", TextType::class);
				$formBuilder->add("dateDeParution", TextType::class);
				$formBuilder->add("valider", SubmitType::class);
				// Generate form
				$form = $formBuilder->getForm();
				$form->submit($article);
				if ($form->isSubmitted()) {
					try {
						$entity = $form->getData();
						$this->entityManager->flush();
						$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
						$query->setParameter("id", $id);
						$article = $query->getArrayResult();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_OK); // 200
						$response->setContent(json_encode($article));
						$response->headers->set('Location', '/wp-json/wc/v3/products/' . $id);
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						$response->headers->set('Access-Control-Expose-Headers', 'Location');
						return $response;
					} catch (ConstraintViolationException $e) {
						$errors = $form->getErrors();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY); // 422
						$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => 'Constraint violation')));
						$response->headers->set('Content-Type', 'application/json');
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						return $response;
					}
				} else {
					$errors = $form->getErrors();
					$response = new Response();
					$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400
					$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => $errors->__toString())));
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
			} elseif ($article["article_type"] == "livre") {
				$entity = $this->entityManager->getRepository(Livre::class)->find($id);
				if (!$entity) {
					$response = new Response();
					$response->setStatusCode(Response::HTTP_NOT_FOUND); // 404
					$response->setContent(json_encode(array('message' => 'Product not found')));
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
				$formBuilder = $this->createFormBuilder($entity, array('csrf_protection' => false));
				$formBuilder->add("titre", TextType::class);
				$formBuilder->add("createur", TextType::class);
				$formBuilder->add("prix", NumberType::class);
				$formBuilder->add("disponibilite", IntegerType::class);
				$formBuilder->add("image", TextType::class);
				$formBuilder->add("ISBN", TextType::class, ['required' => true]);
				$formBuilder->add("nbPages", IntegerType::class);
				$formBuilder->add("dateDeParution", TextType::class);
				$formBuilder->add("valider", SubmitType::class);
				// Generate form
				$form = $formBuilder->getForm();
				$form->submit($article);
				if ($form->isSubmitted()) {
					try {
						$entity = $form->getData();
						$this->entityManager->flush();
						$query = $this->entityManager->createQuery("SELECT a FROM App\Entity\Catalogue\Article a where a.id like :id");
						$query->setParameter("id", $id);
						$article = $query->getArrayResult();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_OK); // 200
						$response->setContent(json_encode($article));
						$response->headers->set('Location', '/wp-json/wc/v3/products/' . $id);
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						$response->headers->set('Access-Control-Expose-Headers', 'Location');
						return $response;
					} catch (ConstraintViolationException $e) {
						$errors = $form->getErrors();
						$response = new Response();
						$response->setStatusCode(Response::HTTP_UNPROCESSABLE_ENTITY); // 422
						$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => 'Constraint violation')));
						$response->headers->set('Content-Type', 'application/json');
						$response->headers->set('Access-Control-Allow-Origin', '*');
						$response->headers->set('Access-Control-Allow-Headers', '*');
						return $response;
					}
				} else {
					$errors = $form->getErrors();
					$response = new Response();
					$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400
					$response->setContent(json_encode(array('message' => 'Invalid input', 'errors' => $errors->__toString())));
					$response->headers->set('Content-Type', 'application/json');
					$response->headers->set('Access-Control-Allow-Origin', '*');
					$response->headers->set('Access-Control-Allow-Headers', '*');
					return $response;
				}
			}
		} else {
			$response = new Response();
			$response->setStatusCode(Response::HTTP_BAD_REQUEST); // 400
			$response->setContent(json_encode(array('message' => 'Invalid input: No article_type found')));
			$response->headers->set('Content-Type', 'application/json');
			$response->headers->set('Access-Control-Allow-Origin', '*');
			$response->headers->set('Access-Control-Allow-Headers', '*');
			return $response;
		}
	}

	/**
	 * @Route("/wp-json/wc/v3/products/{id}", name="delete-product", methods={"DELETE"})
	 */
	public function deleteProduct(Request $request, $id, EntityManagerInterface $entityManager)
	{
		$entity = $this->entityManager->getRepository(Article::class)->find($id);
		if (!$entity) {
			$response = new Response();
			$response->setStatusCode(Response::HTTP_NOT_FOUND); // 404
			$response->setContent(json_encode(array('message' => 'Product not found')));
			$response->headers->set('Content-Type', 'application/json');
			$response->headers->set('Access-Control-Allow-Origin', '*');
			$response->headers->set('Access-Control-Allow-Headers', '*');
			return $response;
		} else {
			$entityManager->remove($entity);
			$entityManager->flush();
			$response = new Response();
			$response->setStatusCode(Response::HTTP_NO_CONTENT); // 204
			$response->headers->set('Access-Control-Allow-Origin', '*');
			$response->headers->set('Access-Control-Allow-Headers', '*');
			return $response;
		}
	}
}
